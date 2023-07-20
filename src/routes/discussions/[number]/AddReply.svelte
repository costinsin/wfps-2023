<script lang="ts">
	let formShown = false;
	let replyText = '';

	function cancel() {
		formShown = false;
		replyText = '';
	}
</script>

<div>
	{#if formShown}
		<form method="POST" action="?/addCommentReply">
			<textarea
				name="replyText"
				bind:value={replyText}
				placeholder="Write a reply"
				cols="100"
				rows="5"
			/>
			<br />
			<button type="submit" disabled={replyText.length === 0}>Reply</button>
			<button type="button" on:click={cancel}>Cancel</button>
		</form>
	{:else}
		<input placeholder="Write a reply" size="100" on:focus={() => (formShown = !formShown)} />
	{/if}
</div>
