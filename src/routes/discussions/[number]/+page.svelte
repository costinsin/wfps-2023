<script lang="ts">
	import { REACTION_EMOJI } from '$lib/reactions';
	import type { DiscussionComment } from '$lib/server/github';
	import AddReaction from './AddReaction.svelte';

	export let data;

	$: ({ discussionId, discussion, comments } = data);
	$: currentReactions = discussion.reactionGroups.filter((group) => group.totalCount > 0);

	async function loadReplies(comment: DiscussionComment) {
		const response = await fetch(`/discussions/${discussionId}/comments/replies/${comment.id}`);
		const replies = await response.json();

		comment.replies = replies;
		comments = comments;
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
		<h2>Comments</h2>
		<ul>
			{#each comments as comment}
				<li>
					{comment.author}
					{comment.createdAt}
					{@html comment.bodyHTML}

					{#if comment.replies !== null}
						<ul>
							{#each comment.replies as reply}
								<li>
									{reply.author}
									{reply.createdAt}
									{@html reply.bodyHTML}
								</li>
							{/each}
						</ul>
					{:else}
						<button on:click={() => loadReplies(comment)}>Show replies</button>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
</style>
