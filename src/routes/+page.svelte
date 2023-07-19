<script lang="ts">
	export let data;
	function prettyFormatTime(time: string): string {
		const uploadTime = new Date(time);
		const currentTime = new Date();
		const diff = currentTime - uploadTime;
		if ( diff <= 1000 * 60 * 60) {
			return ` ${Math.round(diff / 1000 / 60)} minutes ago`;
		}
		if ( diff <= 1000 * 60 * 60 * 24) {
			return ` ${Math.round(diff / 1000 / 60 / 60)} hours ago`;
		}
		return time;
	}
</script>

<svelte:head>
	<title>Discussions</title>
	<meta name="description" content="WPFS 2023 Discussions" />
</svelte:head>

<section>
	<h1>Discussions</h1>
	<ol class="discussions">
		{#each data.discussions as discussion (discussion.number)}
			<li>
				<a href="/discussions/{discussion.number}"><h2>{discussion.title}</h2></a>
				<p>by {discussion.author} on {prettyFormatTime(discussion.createdAt)}</p>
			</li>
		{/each}
	</ol>
</section>

<style>
	.discussions {
		margin: 0;
		padding: 0;
	}

	.discussions li {
		display: block;
	}

	.discussions li:not(:first-child) {
		border-top: 1px solid var(--color-bg-0);
	}
</style>
