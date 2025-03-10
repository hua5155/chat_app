<script lang="ts">
    import Button from '$lib/component/Button.svelte';
    import { setFocus } from '$lib/util/ui';
    import { taskbar } from './store.svelte';
</script>

<section
    class="prose-xl absolute bottom-0 left-0 z-50 hidden h-11 w-screen flex-row gap-2 border-t-2 border-t-white bg-[#bfb8bf] p-1 xl:flex"
>
    <button class="prose-xl select-none px-2">Start</button>
    {#each taskbar.windows as window}
        {@const isFocused = taskbar.focus === window.name}
        <Button
            class="prose-xl select-none px-2"
            pressed={isFocused}
            onclick={() => {
                taskbar.focus = window.name;
                setFocus(window.id);
            }}
        >
            {window.name}
        </Button>
    {/each}
</section>
