<script lang="ts">
    let {
        src,
        iconName,
        ondblclick,
        onclick
    }: {
        src: string;
        iconName: string;
        ondblclick?: () => void;
        onclick?: () => void;
    } = $props();
</script>

<button
    class="relative"
    {onclick}
    {ondblclick}
>
    <img
        class="w-[100px]"
        {src}
        alt=""
        ondragstart={(event) => {
            event.preventDefault();
        }}
    />
    <p class="absolute bottom-0 left-1/2 -translate-x-1/2 text-white">{iconName}</p>
</button>
