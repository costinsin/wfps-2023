import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

import { getCommentReplies } from '$lib/server/github';

export async function GET(request: RequestEvent) {
	const commentId = request.params.commentId;
	const response = await getCommentReplies(commentId);

	return json(response);
}
