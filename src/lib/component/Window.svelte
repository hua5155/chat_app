<script lang="ts">
    import Button from '$lib/component/Button.svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let windowName: string;
    export let id: string;
    export let widthWithUnit: string;
    export let positonX: number;
    export let positonY: number;
    export let zHeight = 0;
    export let minimized: boolean;

    let dragFlag = false;
    let referenceX = 0;
    let referenceY = 0;

    let focused = false;
</script>

<section
    class="absolute left-[--x-position] top-[--y-position] z-[--height] h-fit w-[--width] border-2 border-b-black border-l-white border-r-black border-t-white bg-[#c0c0c0] p-1"
    style:--x-position="{positonX}px"
    style:--y-position="{positonY}px"
    style:--height={zHeight}
    style:--width={widthWithUnit}
    {id}
    tabindex="-1"
    on:focusin={() => {
        focused = true;
        dispatch('focusin');
    }}
    on:focusout={() => {
        focused = false;
        dispatch('focusout');
    }}
>
    <div
        class="flex w-full select-none flex-row justify-center gap-2 bg-gradient-to-r from-[--from] to-[--to] p-1 pl-2 font-bold"
        style:--from={focused ? '#00007f' : '#6b656b'}
        style:--to={focused ? '#0000a6' : '#7f787f'}
        role="none"
        on:mousedown={({ screenX, screenY }) => {
            dragFlag = true;
            referenceX = screenX;
            referenceY = screenY;
        }}
    >
        <p class="prose max-w-none grow text-white">{windowName}</p>
        <Button class="h-7 w-7 text-center align-middle">-</Button>
        <Button class="h-7 w-7 text-center align-middle">+</Button>
        <Button class="h-7 w-7 text-center align-middle">x</Button>
    </div>
    <div class="w-full py-1">
        <div class="w-full border-2 border-b-white border-t-[#837c83]"></div>
    </div>
    <slot></slot>
</section>

<svelte:window
    on:mousemove={({ screenX, screenY }) => {
        if (dragFlag === false) return;

        positonX += screenX - referenceX;
        positonY += screenY - referenceY;

        referenceX = screenX;
        referenceY = screenY;
    }}
    on:mouseup={({}) => {
        dragFlag = false;
    }}
/>

<style>
</style>
