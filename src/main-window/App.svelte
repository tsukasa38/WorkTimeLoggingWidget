<script lang="ts">
	import StopWatch from './components/Stopwatch.svelte';
</script>

<main>
	<StopWatch />
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		user-select: none;
		-webkit-app-region: drag;
	}
</style>