<script lang="ts">
	export let next: string | null = null;
</script>

<div class="pagination">
	{#if next != null}
		<a href="?next={next}">Next page</a>
	{/if}
</div>

<style>
	.pagination {
		margin-top: 2em;
	}

	.pagination a {
		display: inline-block;
		border: 1px solid var(--color-theme-1);
		border-radius: 0.2em;
		padding: 0.5em 1em;
	}
</style>
