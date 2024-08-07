<script lang="ts">
	import Window from '$lib/component/Window.svelte';
	import Button from '$lib/component/Button.svelte';
	import type { ChatServerLoad, ChatWebSocket } from '$drizzle/schema';
	import { dev } from '$app/environment';
	import { scrollToBottom } from '$lib/util/ui';
	import { username, chatSetting, taskbar, zStack } from './store';
	import { getSupabaseClient } from '$lib/client/supabase';

	function onSend() {
		if ($username === '') {
			if (dev) console.log('Empty username');
			return;
		}
		if (message === '') {
			if (dev) console.log('Empty message');
			return;
		}

		if (dev) console.log(`send message: ${message}`);
		const newMessage = { username: $username, message: message };
		fetch('/api/chat', {
			method: 'post',
			body: JSON.stringify(newMessage)
		});

		const withTimestamp = { ...newMessage, timestamp: new Date() };
		chatChannel.send({
			type: 'broadcast',
			event: 'newMessage',
			payload: withTimestamp
		});
		chat = [...chat, withTimestamp];

		history.splice(1, 0, message);
		index = 0;
		message = '';

		scrollToBottom('chat');
	}

	const supabase = getSupabaseClient();
	const chatChannel = supabase.channel('chat');

	export let chat: ChatServerLoad[];

	let message = '';
	let history: string[] = [''];
	let index = 0;

	chatChannel
		.on('broadcast', { event: 'newMessage' }, ({ payload }) => {
			const { timestamp, ...rest } = payload as ChatWebSocket;
			const newMessage = { ...rest, timestamp: new Date(timestamp) };
			chat = [...chat, newMessage];
		})
		.subscribe();

	$: zHeight = $zStack.findIndex((name) => name === chatSetting.name);
</script>

<Window
	windowName={chatSetting.name}
	id={chatSetting.id}
	widthWithUnit="80ch"
	positonX={200}
	positonY={100}
	{zHeight}
	minimized={false}
	on:focusin={() => {
		$taskbar.focus = chatSetting.name;
		zStack.update((name) => {
			const rest = name.filter((name) => name !== chatSetting.name);
			return [...rest, chatSetting.name];
		});
	}}
	on:focusout={() => {
		$taskbar.focus = '';
	}}
>
	<div
		class="prose-xl h-96 w-full max-w-none overflow-y-scroll border-2 border-b-white border-l-black border-r-white border-t-black bg-white"
		id="chat"
		use:scrollToBottom
	>
		{#each chat as message}
			<div class="m-0 flex flex-row text-pretty leading-7 [overflow-anchor:none]">
				<p class="m-0 grow pl-9 -indent-8">
					<span class="text-[#0000ff]">{`<${message.username}> `}</span>
					{message.message}
				</p>
				<p class="m-0 shrink-0 pl-4 pr-2 text-[#7f787f]">
					{message.timestamp.toLocaleTimeString()}
				</p>
			</div>
		{/each}
		<div class="h-[1px] [overflow-anchor:auto]"></div>
	</div>
	<div class="w-full pt-1"></div>
	<div class="flex w-full flex-row gap-2">
		<input
			class="prose-xl grow border-2 border-b-white border-l-black border-r-white border-t-black px-2 focus:outline-none"
			type="text"
			name="message"
			autocomplete="off"
			bind:value={message}
			on:keydown={({ key }) => {
				// if (dev) console.log(key);

				if (key === 'ArrowUp') {
					index += 1;
					if (index > history.length - 1) {
						index = history.length - 1;
					}
					message = history[index];
				}
				if (key === 'ArrowDown') {
					index -= 1;
					if (index < 0) {
						index = 0;
					}
					message = history[index];
				}
				if (key === 'Escape') {
					message = '';
				}
				if (key === 'Enter') {
					onSend();
				}
			}}
		/>
		<Button
			class="prose-xl select-none px-2"
			on:click={() => {
				onSend();
			}}
		>
			Send
		</Button>
	</div>
</Window>

<style>
</style>
