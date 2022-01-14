<script lang="ts">
    import { onMount } from "svelte";

    let time_sec: number = 0;
    let display: string = '00:00:00';

    $: display = format(time_sec);

    function format(time_sec: number): string {
        const hour: number = Math.floor(time_sec / 3600);
        const minute: number = Math.floor((time_sec % 3600) / 60);
        const second: number = time_sec % 60;

        const h: string = `0${hour}`.slice(-2);
        const m: string = `0${minute}`.slice(-2);
        const s: string = `0${second}`.slice(-2);

        return `${h}:${m}:${s}`;
    }

    onMount(() => {
        window.api.time((second: number) => time_sec = second);
    });

</script>

<div class="container">
    <p class="time">{display}</p>
</div>

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