<script lang="ts">
	export let windowName: string;
	export let widthWithUnit: string;
	export let positonX: number;
	export let positonY: number;

	let dragFlag = false;
	let referenceX = 0;
	let referenceY = 0;

	let focused = false;
</script>

<section
	class="absolute left-[--x-position] top-[--y-position] h-fit w-[--width] border-2 border-b-black border-l-white border-r-black border-t-white bg-[#c0c0c0] p-1"
	class:z-0={!focused}
	class:z-10={focused}
	style:--x-position="{positonX}px"
	style:--y-position="{positonY}px"
	style:--width={widthWithUnit}
	tabindex="-1"
	on:focusin={() => {
		focused = true;
	}}
	on:focusout={() => {
		focused = false;
	}}
>
	<div
		class="flex w-full select-none flex-row justify-center gap-2 bg-gradient-to-r p-1 pl-2 font-bold"
		class:from-[#6b656b]={!focused}
		class:to-[#7f787f]={!focused}
		class:from-[#00007f]={focused}
		class:to-[#0000a6]={focused}
		role="none"
		on:mousedown={({ screenX, screenY }) => {
			dragFlag = true;
			referenceX = screenX;
			referenceY = screenY;
		}}
	>
		<p class="prose max-w-none grow text-white">{windowName}</p>
		<button class="h-7 w-7 text-center align-middle">-</button>
		<button class="h-7 w-7 text-center align-middle">+</button>
		<button class="h-7 w-7 text-center align-middle">x</button>
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
