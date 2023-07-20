<script lang="ts">
	let newCommentText = '';
</script>

<form method="POST" action="?/addComment">
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
