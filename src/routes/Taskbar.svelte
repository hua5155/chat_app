<script lang="ts">
	import { taskbar } from './store';
	import { setFocus } from '$lib/util/ui';
</script>

<section
	class="prose-xl absolute bottom-0 left-0 flex h-11 w-screen flex-row gap-2 border-t-2 border-t-white bg-[#bfb8bf] p-1"
>
	<button class="prose-xl select-none px-2">Start</button>
	{#each $taskbar.windows as window}
		{@const isFocused = $taskbar.focus === window.name}
		<button
			class="prose-xl select-none px-2"
			class:border-b-white={isFocused}
			class:border-l-black={isFocused}
			class:border-r-white={isFocused}
			class:border-t-black={isFocused}
			class:bg-[#b3aab3]={isFocused}
			on:click={() => {
				$taskbar.focus = window.name;
				setFocus(window.id);
			}}
		>
			{window.name}
		</button>
	{/each}
</section>
