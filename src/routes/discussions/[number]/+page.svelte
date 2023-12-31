<script lang="ts">
	import type { DiscussionComment, DiscussionReply } from '$lib/server/github';
	import AddComment from './AddComment.svelte';
	import Comment from './Comment.svelte';
	import Reactions from './Reactions.svelte';

	export let data;

	$: ({ discussionId, discussion, lazy } = data);

	let loadingReplies: { [commentId: string]: boolean } = {};
	let replies: { [commentId: string]: DiscussionReply[] } = {};
	let newComments: DiscussionComment[] = [];

	function onNewComment(comment: DiscussionComment) {
		newComments = [comment, ...newComments];
	}

	async function loadReplies(comment: DiscussionComment) {
		loadingReplies[comment.id] = true;

		const response = await fetch(`/discussions/${discussionId}/comments/replies/${comment.id}`);
		const fetchedReplies = await response.json();

		loadingReplies[comment.id] = false;
		replies[comment.id] = fetchedReplies;
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

	<Reactions reactions={discussion.reactionGroups} objectId={'' + discussionId} />

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
					<Comment
						{comment}
						loadingReplies={loadingReplies[comment.id]}
						replies={replies[comment.id]}
						{loadReplies}
					/>
				{/each}
				{#each comments as comment}
					<Comment
						{comment}
						loadingReplies={loadingReplies[comment.id]}
						replies={replies[comment.id]}
						{loadReplies}
					/>
				{/each}
			</ul>
		{:catch error}
			{error.message}
		{/await}
	</div>
</section>
