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
				placeholder="Say something..."
				cols="100"
				rows="10"
			/>
			<br />
			<button type="submit">Save</button>
			<button type="button" on:click={cancel}>Cancel</button>
		</form>
	{:else}
		<button on:click={() => (formShown = !formShown)}>Add a new reply</button>
	{/if}
</div>
