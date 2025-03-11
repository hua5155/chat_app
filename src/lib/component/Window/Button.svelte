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
    class="h-7 w-7 border-2 border-b-black border-l-white border-r-black border-t-white bg-[#bfb8bf] text-center align-middle"
    class:!border-b-white={pressed}
    class:!border-l-black={pressed}
    class:!border-r-white={pressed}
    class:!border-t-black={pressed}
    class:!bg-[#b3aab3]={pressed}
    onmousedown={() => {
        pressed = true;
    }}
    onmouseup={() => {
        pressed = false;
    }}
    {onclick}
>
    {@render children?.()}
</button>
