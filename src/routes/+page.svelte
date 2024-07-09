<script lang="ts">
	import Chat from './Chat.svelte';
	import CLI from './CLI.svelte';
	import Taskbar from './Taskbar.svelte';
	import type { PageData } from './$types';
	import { dev } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { username } from './store';

	function getRandomNumber(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	export let data: PageData;
	// if (dev) console.log(data.messages);

	onMount(() => {
		$username = `User${getRandomNumber(0, 9999)}`;
	});

	// onDestroy(() => {});
</script>

<main
	class="relative h-screen w-screen overflow-hidden bg-[#008080] font-['Source_Code_Pro','Noto_Sans_TC'] text-black"
>
	<Chat bind:chat={data.messages}></Chat>
	<CLI></CLI>
	<Taskbar></Taskbar>
</main>

<style>
	button {
		@apply border-2 border-b-black border-l-white border-r-black border-t-white bg-[#bfb8bf];
	}
</style>
