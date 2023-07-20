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
	comments: DiscussionComment[];
}

export const load: PageServerLoad<Data> = async ({ params }) => {
	const number = Number(params.number);
	if (isNaN(number)) {
		throw error(404, 'invalid discussion number');
	}

	const discussion = await getDiscussionDetails(number);
	const comments = await getDiscussionComments(number);

	return { discussionId: number, discussion, comments };
};

export const actions: Actions = {
	addComment: async (event) => {
		const request = event.request;
		const data = await request.formData();

		console.log(`adding a new comment for discussion ${event.params.number}`, data);
	},
	addCommentReply: async (event) => {
		const request = event.request;
		const data = await request.formData();

		console.log(`adding a new reply for discussion ${event.params.number}`, data);
	}
};
