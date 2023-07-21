<script lang="ts">
	import { enhance } from '$app/forms';
	import { REACTIONS, REACTION_EMOJI } from '$lib/reactions';

	export let objectId: string;
	let shown = false;

	const onReactionPost = () => {
		shown = false;
	};
</script>

<div class="add-reaction">
	<button on:click={() => (shown = true)}>Add reaction</button>
	<dialog open={shown}>
		<form method="post" action="?/addReaction" use:enhance={onReactionPost}>
			<input type="hidden" name="objectId" value={objectId} />
			{#each REACTIONS as reaction}
				<button type="submit" name="reaction" value={reaction}>
					{REACTION_EMOJI[reaction]}
				</button>{' '}
			{/each}
		</form>
	</dialog>
</div>

<style>
	.add-reaction {
		display: inline-block;
		position: relative;
	}

	dialog {
		left: calc(100% + 0.3em);
		top: 0;
		white-space: nowrap;
		border: 1px solid var(--color-bg-1);
		border-radius: 0.5em;
		padding: 0.3em;
	}
</style>
