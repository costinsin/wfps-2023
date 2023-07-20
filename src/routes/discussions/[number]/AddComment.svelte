<script lang="ts">
	import { enhance } from '$app/forms';
	import type { DiscussionComment } from '$lib/server/github';
	import type { ActionResult } from '@sveltejs/kit';

	export let onNewComment: ((comment: DiscussionComment) => void) | undefined = undefined;

	let newCommentText = '';

	function handleResult({
		formElement,
		result,
		update
	}: {
		formElement: HTMLFormElement;
		result: ActionResult;
		update(): Promise<void>;
	}) {
		if (result.type === 'success' && onNewComment) {
			onNewComment(result.data as DiscussionComment);
			// update() will also call invalidateAll(), which triggers the load() functions on
			// the server. If we don't want that, we can instead the page manually, e.g. like this:
			formElement.reset();
		} else {
			update();
		}
	}
</script>

<form method="POST" action="?/addComment" use:enhance={() => handleResult}>
	<textarea
		name="commentText"
		bind:value={newCommentText}
		placeholder="Write a comment"
		cols="100"
		rows="5"
	/>
	<br />
	<button type="submit" disabled={newCommentText.length === 0}>Comment</button>
</form>
