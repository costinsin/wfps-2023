<script lang="ts">
	import type { DiscussionComment, DiscussionReply } from '$lib/server/github';
	import AddReply from './AddReply.svelte';
	import Reactions from './Reactions.svelte';

	export let comment: DiscussionComment;
	export let loadingReplies: boolean;
	export let replies: DiscussionReply[] | undefined;
	export let loadReplies: (comment: DiscussionComment) => Promise<void>;
</script>

<li>
	{comment.author}
	{comment.createdAt}
	<div>{@html comment.bodyHTML}</div>

	<Reactions reactions={comment.reactionGroups} objectId={comment.id} />

	{#if comment.repliesCount > 0}
		{#if replies != null}
			<ul>
				{#each replies as reply}
					<li>
						{reply.author}
						{reply.createdAt}
						{@html reply.bodyHTML}
					</li>
					<Reactions reactions={reply.reactionGroups} objectId={comment.id} />
				{/each}
			</ul>
		{:else}
			<button on:click={() => loadReplies(comment)} disabled={loadingReplies}>
				{#if loadingReplies}⌛{/if} Show replies
			</button>
		{/if}
	{:else}
		<i>There are no replies to this comment</i>
	{/if}

	<AddReply />
</li>
