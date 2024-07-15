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
	class="relative h-screen w-screen overflow-hidden bg-[#008080] font-['Source_Code_Pro','Noto_Sans_TC'] text-black"
>
	<div class="grid h-fit w-fit grid-flow-row *:select-none">
		<Icon url="/icon/chat.svg" id={chatSetting.id} iconName="chat"></Icon>
		<Icon url="/icon/cli.svg" id={cliSetting.id} iconName="CLI"></Icon>
	</div>
	<Chat bind:chat={data.messages}></Chat>
	<CLI></CLI>
	<Taskbar></Taskbar>
</main>

<style>
</style>
