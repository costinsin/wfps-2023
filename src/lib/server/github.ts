import { env } from '$env/dynamic/private';
import { App } from 'octokit';

import GITHUB_KEY from '../../../.env.private-key.pem?raw';
import type { REACTIONS } from '../reactions';

function requireEnv(key: string): string {
	const value = env[key];
	if (value == null) {
		throw new Error(`Missing ${key} env var. Did you create a .env file?`);
	}

	return value;
}

const GITHUB_APP_ID = requireEnv('GITHUB_APP_ID');
const GITHUB_CLIENT_ID = requireEnv('GITHUB_CLIENT_ID');
const GITHUB_CLIENT_SECRET = requireEnv('GITHUB_CLIENT_SECRET');
const GITHUB_INSTALLATION_ID = Number(requireEnv('GITHUB_INSTALLATION_ID'));
const GITHUB_REPO_NAME = requireEnv('GITHUB_REPO_NAME');
const GITHUB_REPO_OWNER = requireEnv('GITHUB_REPO_OWNER');

interface QueryVariables {
	[name: string]: unknown;
}

async function queryGraphQl(query: string, variables?: QueryVariables): Promise<unknown> {
	const app = new App({
		appId: GITHUB_APP_ID,
		privateKey: GITHUB_KEY,
		oauth: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }
	});
	const octokit = await app.getInstallationOctokit(GITHUB_INSTALLATION_ID);

	return await octokit.graphql(
		query,
		Object.assign(
			{
				repoOwner: GITHUB_REPO_OWNER,
				repoName: GITHUB_REPO_NAME
			},
			variables
		)
	);
}

export interface Page<T> {
	items: T[];
	next: string | undefined;
}

export interface Discussion {
	number: number;
	title: string;
	author: string;
	createdAt: string;
}

export interface ReactionGroup {
	content: (typeof REACTIONS)[number];
	totalCount: number;
}

export interface DiscussionDetails extends Discussion {
	reactionGroups: ReactionGroup[];
	bodyHTML: string;
}

export async function getDiscussionList(next?: string): Promise<Page<Discussion>> {
	const body = await queryGraphQl(
		`query discussionList($repoOwner: String!, $repoName: String!, $after: String) {
			repository(owner: $repoOwner, name: $repoName) {
				discussions(first: 5, after: $after) {
					pageInfo {
						endCursor
						hasNextPage
					}
					nodes {
						number
						title
						author {
							login
						}
						createdAt
					}
				}
			}
		}`,
		{ after: next }
	);
	const pageInfo = (body as any).repository.discussions.pageInfo;
	const discussions = (body as any).repository.discussions.nodes;
	const items = discussions.map((discussion: any) => ({
		number: discussion.number,
		title: discussion.title,
		author: discussion.author.login,
		createdAt: discussion.createdAt
	}));
	return {
		items,
		next: pageInfo.hasNextPage ? pageInfo.endCursor : undefined
	};
}

export async function getDiscussionDetails(number: number): Promise<DiscussionDetails> {
	const body = await queryGraphQl(
		`
    query discussionDetails($repoOwner: String!, $repoName: String!, $number: Int!) {
      repository(owner: $repoOwner, name: $repoName) {
        discussion(number: $number) {
          number
          title
          author {
            login
          }
          createdAt
          reactionGroups {
            content
            reactors {
              totalCount
            }
          }
          bodyHTML
        }
      }
		}
	`,
		{ number }
	);
	const discussion = (body as any).repository.discussion;
	return {
		number: discussion.number,
		title: discussion.title,
		author: discussion.author.login,
		createdAt: discussion.createdAt,
		reactionGroups: discussion.reactionGroups.map((group: any) => ({
			content: group.content,
			totalCount: group.reactors.totalCount
		})),
		bodyHTML: discussion.bodyHTML
	};
}

export interface DiscussionReply {
	author: string;
	createdAt: string;
	bodyHTML: string;
}

export interface DiscussionComment {
	id: string;
	author: string;
	createdAt: string;
	bodyHTML: string;
	replies: DiscussionReply[] | null;
}

export async function getDiscussionComments(number: number): Promise<DiscussionComment[]> {
	const body = await queryGraphQl(
		`
		query discussionComments($repoOwner: String!, $repoName: String!, $number: Int!) {
			repository(owner: $repoOwner, name: $repoName) {
				discussion(number: $number) {
					comments(last: 10) {
						edges {
							node {
								id
								author {
									login
								}
								createdAt
								bodyHTML
							}
						}
					}
				}
			}
		}
	`,
		{ number }
	);
	const comments = (body as any).repository.discussion.comments.edges;

	return comments.map((comment: any) => ({
		id: comment.node.id,
		author: comment.node.author.login,
		createdAt: comment.node.createdAt,
		bodyHTML: comment.node.bodyHTML,
		replies: null
	}));
}

export async function getCommentReplies(commentId: string): Promise<DiscussionReply[]> {
	const body = await queryGraphQl(
		`
		query commentReplies($commentId: ID!) {
			node(id: $commentId) {
				id
				... on DiscussionComment {				
					createdAt
					replies(last: 10) {
						totalCount
						nodes {
							id
							author {
								login
							}
							createdAt
							bodyHTML
						}
					}
			}
			}
		}
	`,
		{ commentId }
	);

	const replies = (body as any).node.replies.nodes;

	return replies.map((reply: any) => ({
		author: reply.author.login,
		createdAt: reply.createdAt,
		bodyHTML: reply.bodyHTML
	}));
}
