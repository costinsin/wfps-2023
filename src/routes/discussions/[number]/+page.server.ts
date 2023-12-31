import { error } from '@sveltejs/kit';

import {
	getDiscussionComments,
	getDiscussionDetails,
	type DiscussionComment,
	type DiscussionDetails
} from '$lib/server/github';

import type { PageServerLoad, Actions } from './$types';

export interface Data {
	discussion: DiscussionDetails;
	lazy: {
		comments: Promise<DiscussionComment[]>;
	};
}

export const load: PageServerLoad<Data> = async ({ params }) => {
	const number = Number(params.number);
	if (isNaN(number)) {
		throw error(404, 'invalid discussion number');
	}

	const discussion = await getDiscussionDetails(number);

	return {
		discussionId: number,
		discussion,
		lazy: { comments: getDiscussionComments(number) }
	};
};

export const actions: Actions = {
	addComment: async (event): Promise<DiscussionComment> => {
		const request = event.request;
		const data = await request.formData();

		console.log(`adding a new comment for discussion ${event.params.number}`, data);

		return {
			id: 'new-comment',
			author: 'you',
			createdAt: new Date().toISOString(),
			bodyHTML: data.get('commentText')?.toString() ?? 'oh no, no text. that should not happen',
			repliesCount: 0
		};
	},
	addCommentReply: async (event) => {
		const request = event.request;
		const data = await request.formData();

		console.log(`adding a new reply for discussion ${event.params.number}`, data);
	},
	addReaction: async (event) => {
		const request = event.request;
		const data = await request.formData();

		console.log(`adding a new reaction`, data);
	}
};
