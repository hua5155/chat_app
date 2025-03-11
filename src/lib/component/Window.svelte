<script lang="ts">
    import Button from '$lib/component/Window/Button.svelte';

    let {
        windowName,
        id,
        widthWithUnit,
        positonX = $bindable(),
        positonY = $bindable(),
        zHeight = 0,
        minimized = $bindable(true),
        children,
        onfocusin,
        onfocusout,
        onclose
    }: {
        windowName: string;
        id: string;
        widthWithUnit: string;
        positonX: number;
        positonY: number;
        zHeight?: number;
        minimized?: boolean;
        children?: import('svelte').Snippet;
        onfocusin?: () => void;
        onfocusout?: () => void;
        onclose?: () => void;
    } = $props();

    let dragFlag = $state(false);
    let referenceX = $state(0);
    let referenceY = $state(0);

    let focused = $state(false);
</script>

<section
    class="absolute left-0 top-0 z-[--height] flex h-dvh w-lvw flex-col border-2 border-b-black border-l-white border-r-black border-t-white bg-[#c0c0c0] p-1 xl:left-[--x-position] xl:top-[--y-position] xl:h-fit xl:w-[--width]"
    class:hidden={minimized}
    style:--x-position="{positonX}px"
    style:--y-position="{positonY}px"
    style:--height={zHeight}
    style:--width={widthWithUnit}
    {id}
    tabindex="-1"
    onfocusin={() => {
        focused = true;
        if (onfocusin) onfocusin();
    }}
    onfocusout={() => {
        focused = false;
        if (onfocusout) onfocusout();
    }}
>
    <div
        class="flex w-full select-none flex-row justify-center gap-2 bg-gradient-to-r from-[--from] to-[--to] p-1 pl-2 font-bold"
        style:--from={focused ? '#00007f' : '#6b656b'}
        style:--to={focused ? '#0000a6' : '#7f787f'}
        role="none"
        onmousedown={({ screenX, screenY }) => {
            dragFlag = true;
            referenceX = screenX;
            referenceY = screenY;
        }}
    >
        <p class="prose max-w-none grow text-white">{windowName}</p>
        <Button
            onclick={() => {
                minimized = true;
            }}
        >
            -
        </Button>
        <Button>+</Button>
        <Button
            onclick={() => {
                minimized = true;
                if (onclose) onclose();
            }}
        >
            x
        </Button>
    </div>
    <div class="w-full py-1">
        <div class="w-full border-2 border-b-white border-t-[#837c83]"></div>
    </div>
    {@render children?.()}
</section>

<svelte:window
    onmousemove={({ screenX, screenY }) => {
        if (dragFlag === false) return;

        positonX += screenX - referenceX;
        positonY += screenY - referenceY;

        referenceX = screenX;
        referenceY = screenY;
    }}
    onmouseup={({}) => {
        dragFlag = false;
    }}
/>

<style>
</style>
