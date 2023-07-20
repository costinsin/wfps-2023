<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import type { DiscussionComment, DiscussionReply } from '$lib/server/github';
	import AddReply from './AddReply.svelte';

	export let comment: DiscussionComment;
	let loadingReplies: boolean;
	let replies: DiscussionReply[] | undefined;

	function handleResult(result: ActionResult) {
		if (result.type === 'success') {
			replies = result.data as DiscussionReply[];
		}
	}
</script>

<li>
	{comment.author}
	{comment.createdAt}
	<div>{@html comment.bodyHTML}</div>

	{#if comment.repliesCount > 0}
		{#if replies != null}
			<ul>
				{#each replies as reply}
					<li>
						{reply.author}
						{reply.createdAt}
						{@html reply.bodyHTML}
					</li>
				{/each}
			</ul>
		{:else}
			<form
				method="POST"
				action="?/loadCommentReplies"
				use:enhance={() => {
					loadingReplies = true;
					return ({ result }) => {
						loadingReplies = false;
						handleResult(result);
					};
				}}
			>
				<input type="hidden" name="commentId" value={comment.id} />
				<button disabled={loadingReplies}>
					{#if loadingReplies}⌛{/if} Show replies
				</button>
			</form>
		{/if}
	{:else}
		<i>There are no replies to this comment</i>
	{/if}

	<AddReply />
</li>
