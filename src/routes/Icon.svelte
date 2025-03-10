<script lang="ts">
    let {
        src,
        iconName,
        ondblclick
    }: {
        src: string;
        iconName: string;
        ondblclick: () => void;
    } = $props();
</script>

<div class="relative">
    <img
        class="w-[100px]"
        {src}
        alt=""
        ondragstart={(event) => {
            event.preventDefault();
        }}
        {ondblclick}
    />
    <p class="absolute bottom-0 left-1/2 -translate-x-1/2 text-white">{iconName}</p>
</div>
