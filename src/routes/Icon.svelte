<script lang="ts">
    export let src: string;
    export let iconName: string;
</script>

<div class="relative">
    <img
        class="w-[100px]"
        {src}
        alt=""
        on:dragstart|preventDefault
        on:dblclick
    />
    <p class="absolute bottom-0 left-1/2 -translate-x-1/2 text-white">{iconName}</p>
</div>
