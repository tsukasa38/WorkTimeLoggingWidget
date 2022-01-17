<script lang='ts'>
    import { onMount } from "svelte";

    onMount(() => {
        window.api.notification((data: NotificationData) => {
            const tag = data.tag;
            const body = data.body;
            const title = data.title;

            new Notification(title, { body, tag });
        });
    });
</script>