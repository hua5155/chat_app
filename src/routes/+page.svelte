<script lang="ts">
	import Chat from './Chat.svelte';
	import CLI from './CLI.svelte';
	import Taskbar from './Taskbar.svelte';
	import Icon from './Icon.svelte';
	import type { PageData } from './$types';
	import { dev } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { username, cliSetting, chatSetting } from './store';
	import { setFocus } from '$lib/util/ui';

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
	class="relative h-screen w-screen overflow-hidden bg-[#008080] p-5 font-['Source_Code_Pro','Noto_Sans_TC'] text-black"
>
	<div class="grid h-fit w-fit grid-flow-row *:select-none">
		<Icon
			src="/icon/chat.png"
			iconName="Chat"
			on:dblclick={() => {
				setFocus(chatSetting.id);
			}}
		></Icon>
		<Icon
			src="/icon/cli.png"
			iconName="CLI"
			on:dblclick={() => {
				setFocus(cliSetting.id);
			}}
		></Icon>
		<div class="relative">
			<a href="https://github.com/hua5155/chat_app" target="_blank" rel="noopener noreferrer">
				<img class="w-[100px]" src="/icon/github.png" alt="" on:dragstart|preventDefault />
			</a>
			<p class="absolute bottom-0 left-1/2 -translate-x-1/2 text-white">GitHub</p>
		</div>
	</div>
	<Chat bind:chat={data.messages}></Chat>
	<CLI></CLI>
	<Taskbar></Taskbar>
</main>

<style>
</style>
