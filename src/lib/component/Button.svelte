<script lang="ts">
    let className = '';
    export { className as class };

    export let pressed = false;
</script>

<button
    class={className}
    class:border-b-white={pressed}
    class:border-l-black={pressed}
    class:border-r-white={pressed}
    class:border-t-black={pressed}
    class:bg-[#b3aab3]={pressed}
    on:mousedown={() => {
        pressed = true;
    }}
    on:mouseup={() => {
        pressed = false;
    }}
    on:click
>
    <slot></slot>
</button>

<!-- <svelte:window /> -->
