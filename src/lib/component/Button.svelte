<script lang="ts">
    let {
        class: className = '',
        pressed = $bindable(false),
        children,
        onclick
    }: {
        class?: string;
        pressed?: boolean;
        children: any;
        onclick?: () => void;
    } = $props();
</script>

<button
    class={className}
    class:border-b-white={pressed}
    class:border-l-black={pressed}
    class:border-r-white={pressed}
    class:border-t-black={pressed}
    class:bg-[#b3aab3]={pressed}
    onmousedown={() => {
        pressed = true;
    }}
    onmouseup={() => {
        pressed = false;
    }}
    onclick={() => {
        if (onclick) onclick();
    }}
>
    {@render children?.()}
</button>

<!-- <svelte:window /> -->
