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
</style>
