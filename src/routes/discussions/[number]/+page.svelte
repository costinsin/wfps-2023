<script lang="ts">
	import { REACTION_EMOJI } from '$lib/reactions';
	import type { DiscussionComment, DiscussionReply } from '$lib/server/github';
	import AddComment from './AddComment.svelte';
	import AddReaction from './AddReaction.svelte';
	import Comment from './Comment.svelte';

	export let data;

	$: ({ discussion, lazy } = data);
	$: currentReactions = discussion.reactionGroups.filter((group) => group.totalCount > 0);

	let newComments: DiscussionComment[] = [];

	function onNewComment(comment: DiscussionComment) {
		newComments = [comment, ...newComments];
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
		<AddComment {onNewComment} />
		<hr />
		<h2>Comments</h2>
		{#await lazy.comments}
			Loading...
		{:then comments}
			<ul>
				{#each newComments as comment}
					<Comment {comment} />
				{/each}
				{#each comments as comment}
					<Comment {comment} />
				{/each}
			</ul>
		{:catch error}
			{error.message}
		{/await}
	</div>
</section>
