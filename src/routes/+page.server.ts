import { type Discussion, getDiscussionList } from '../lib/server/github';

import type { PageServerLoad } from './$types';

export interface Data {
	discussions: Discussion[];
	next: string | undefined;
}

export const load: PageServerLoad<Data> = async ({ fetch, url }) => {
	const page = await getDiscussionList(url.searchParams.get('next'));
	return {
		discussions: page.items,
		next: page.next
	};
};
