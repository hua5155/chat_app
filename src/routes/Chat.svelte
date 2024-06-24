<script lang="ts">
	import Window from '$lib/component/Window.svelte';
	import { scrollToBottom } from '$lib/ui/util';
</script>

<Window windowName="Chat" positonX={200} positonY={100}>
	<div class="w-full py-1">
		<div class="w-full border-2 border-b-white border-t-[#837c83]"></div>
	</div>
	<div
		class="prose-xl h-96 w-full max-w-none overflow-y-scroll border-2 border-b-white border-l-black border-r-white border-t-black bg-white"
		use:scrollToBottom
	>
		<slot></slot>
		<div class="h-[1px] [overflow-anchor:auto]"></div>
	</div>
	<div class="w-full pt-1"></div>
	<slot name="message"></slot>
</Window>

<style>
	button {
		@apply border-2 border-b-black border-l-white border-r-black border-t-white bg-[#bfb8bf];
	}
</style>
