<script lang="ts">
	export let next: string | null = null;
</script>

<div class="pagination">
	<a href="?next={next}" hidden={next == null}>Next</a>
</div>
