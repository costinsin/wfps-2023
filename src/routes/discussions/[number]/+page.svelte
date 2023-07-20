<script lang="ts">
	import { REACTION_EMOJI } from '$lib/reactions
	import type { DiscussionComment, DiscussionReply } from '$lib/server/github';
	import AddComment from './AddComment.svelte';
	import AddReaction from './AddReaction.svelte';
	import AddReply from './AddReply.svelte';

	export let data;

	$: ({ discussionId, discussion, lazy } = data);
	$: currentReactions = discussion.reactionGroups.filter((group) => group.totalCount > 0);

	let loadingReplies: { [commentId: string]: boolean };
	let replies: { [commentId: string]: DiscussionReply[] };

	async function loadReplies(comment: DiscussionComment) {
		loadingReplies[comment.id] = true;

		const response = await fetch(`/discussions/${discussionId}/comments/replies/${comment.id}`);
		const replies = await response.json();

		loadingReplies[comment.id] = true;
		replies[comment.id] = replies;
	}
</script>

<svelte:head>
	<title>{discussion.title} - Discussions</title>
	<meta name="description" content="WPFS 2023 Discussions" />
</svelte:head>

<section>
	<h1>{discussion.title}</h1>
	<p>by {discussion.author} on {discussion.createdAt}</p>
	<div>{@html discussion.bodyHTML}</div>
	<div class="reactions">
		{#each currentReactions as group (group.content)}
			<button disabled>
				{REACTION_EMOJI[group.content]}
				{group.totalCount}
			</button>{' '}
		{/each}
		<AddReaction />
	</div>
	<div class="comments">
		<hr />
		<AddComment />
		<hr />
		<h2>Comments</h2>
		{#await lazy.comments}
			Loading...
		{:then comments}
			<ul>
				{#each comments as comment}
					<li>
						{comment.author}
						{comment.createdAt}
						{@html comment.bodyHTML}

						{#if comment.repliesCount > 0}
							{#if replies[comment.id] != null}
								<ul>
									{#each replies[comment.id] as reply}
										<li>
											{reply.author}
											{reply.createdAt}
											{@html reply.bodyHTML}
										</li>
									{/each}
								</ul>
							{:else}
								<button on:click={() => loadReplies(comment)} disabled={loadingReplies[comment.id]}>
									{#if loadingReplies[comment.id]}⌛{/if} Show replies
								</button>
							{/if}
						{:else}
							<i>There are no replies to this comment</i>
						{/if}

						<AddReply />
					</li>
				{/each}
			</ul>
		{:catch error}
			{error.message}
		{/await}
	</div>
</section>
