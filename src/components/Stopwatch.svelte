<script lang="ts">
    import { onMount } from "svelte";
    import StopwatchCore from "./StopwatchCore.svelte";

    let time_sec: number = 0;
    let time_msec: number = 0;
    let power_on: boolean = false;
    let display: string = '00:00:00';

    $: time_sec = toSec(time_msec);
    $: display = format(time_sec);

    function toSec(msec: number): number {
        return Math.floor(msec/1000);
    }

    function format(time_sec: number): string {
        const hour: number = Math.floor(time_sec / 3600);
        const minute: number = Math.floor((time_sec % 3600) / 60);
        const second: number = time_sec % 60;

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
        time_msec = 0;
    }

    onMount(() => {
        start();

        window.api.on('powerMonitor', (arg) => {
            const type: string = arg.type;

            if(type === 'resume') { start(); }
            if(type === 'suspend') { stop(); reset(); }
        });
    });

</script>

<StopwatchCore bind:elapsed_time={time_msec} bind:power_on={power_on}>
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