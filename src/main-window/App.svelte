<script lang="ts">
	import StopWatch from './components/Stopwatch.svelte';
	import Notification from './components/Notification.svelte';
</script>

<main>
	<StopWatch />
	<Notification />
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		user-select: none;
		-webkit-app-region: drag;
	}
</style>