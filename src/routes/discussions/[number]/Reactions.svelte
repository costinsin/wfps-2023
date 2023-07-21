<script lang="ts">
	import { REACTION_EMOJI } from '$lib/reactions';
	import type { ReactionGroup } from '$lib/server/github';
	import AddReaction from './AddReaction.svelte';

	export let reactions: ReactionGroup[];
	export let objectId: string;
</script>

<div class="reactions">
	{#each reactions as group (group.content)}
		<button disabled>
			{REACTION_EMOJI[group.content]}
			{group.totalCount}
		</button>{' '}
	{/each}
	<AddReaction {objectId} />
</div>
