<script lang="ts">
    import '../app.css';

    let { children } = $props();
</script>

<svelte:head>
    <title>SvelteKit Chat App</title>
    <meta
        name="description"
        content="A Windows 95 themed chat app"
    />
</svelte:head>

{@render children?.()}

<style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Ubuntu+Sans+Mono:ital,wght@0,400..700;1,400..700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap');
</style>
