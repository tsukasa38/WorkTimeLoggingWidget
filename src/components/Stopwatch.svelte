<script lang="ts">
    import { onMount } from "svelte";
    import StopwatchCore from "./StopwatchCore.svelte";

    let msec: number = 0;
    let power_on: boolean = false;

    $: display = format(msec);

    function format(msec: number): string {
        const total_seconds: number = Math.floor(msec/1000);

        const hour: number = Math.floor(total_seconds / 3600);
        const minute: number = Math.floor((total_seconds % 3600) / 60);
        const second: number = total_seconds % 60;

        const h: string = `0${hour}`.slice(-2);
        const m: string = `0${minute}`.slice(-2);
        const s: string = `0${second}`.slice(-2);

        return `${h}:${m}:${s}`;
    }

    function start(): void {
        power_on = true;
    }

    function stop(): void {
        power_on = false;
    }

    function reset(): void {
        msec = 0;
    }

    onMount(() => {
        start();
        window.api.on('powerMonitor', (arg) => {
            const type: string = arg.type;

            if(type === 'resume') { msec = 0; }
            if(type === 'suspend') { msec = 0; }
        });
    });

</script>

<StopwatchCore bind:elapsed_time={msec} bind:power_on={power_on}>
    <div class="container">
        <p class="time">{display}</p>
    </div>
</StopwatchCore>

<style>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #bdc1c6;
        border-radius: 1rem;
		background-color: #202124;
    }
    .time {
        font-size: 3rem;
        font-weight: bold;
    }
</style>