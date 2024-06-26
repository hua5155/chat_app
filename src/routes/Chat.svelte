<script lang="ts">
	import Window from '$lib/component/Window.svelte';
	import type { SelectChatSchema, ChatSSE } from '$drizzle/schema';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { scrollToBottom } from '$lib/util/ui';
	import { username } from './store';

	export let chat: SelectChatSchema[];

	let reply = '';
	let history: string[] = [''];
	let index = 0;

	onMount(() => {
		const eventSource = new EventSource('/api/chat');
		eventSource.onmessage = (event) => {
			console.log(event.data);
		};
		eventSource.onerror = (err) => {
			console.log(err);
		};
		eventSource.addEventListener('subscribe', (event) => {
			console.log(event.data);
		});
		eventSource.addEventListener('update', (event) => {
			const eventData = JSON.parse(event.data) as ChatSSE[];
			const newMessages = eventData.map((value) => {
				const { timestamp, ...rest } = value;
				return { ...rest, timestamp: new Date(timestamp) };
			});
			chat = [...chat, ...newMessages];
		});

		return () => {
			console.log('closing connection');
			eventSource.close();
		};
	});
</script>

<Window windowName="Chat" positonX={200} positonY={100}>
	<div class="w-full py-1">
		<div class="w-full border-2 border-b-white border-t-[#837c83]"></div>
	</div>
	<div
		class="prose-xl h-96 w-full max-w-none overflow-y-scroll border-2 border-b-white border-l-black border-r-white border-t-black bg-white"
		use:scrollToBottom
	>
		{#each chat as message (message.id)}
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
	<form
		class="flex w-full flex-row gap-2"
		action="?/sendMessage"
		method="post"
		autocomplete="off"
		use:enhance={({ formData, cancel }) => {
			if ($username === '') {
				console.log('Empty username');
				cancel();
			}
			if (reply === '') {
				console.log('Empty message');
				cancel();
			}

			history.splice(1, 0, reply);
			index = 0;
			reply = '';

			formData.append('username', $username);
			// if (dev) console.log(formData);
			// cancel();

			// return async ({ result, update }) => {
			// 	if (dev) console.log(document.activeElement);
			// 	update();
			// };
		}}
	>
		<input
			class="prose-xl grow border-2 border-b-white border-l-black border-r-white border-t-black px-2 focus:outline-none"
			type="text"
			name="message"
			autofocus={true}
			bind:value={reply}
			on:keydown={({ key }) => {
				// if (dev) console.log(key);

				if (key === 'ArrowUp') {
					index += 1;
					if (index > history.length - 1) {
						index = history.length - 1;
					}
					reply = history[index];
				}
				if (key === 'ArrowDown') {
					index -= 1;
					if (index < 0) {
						index = 0;
					}
					reply = history[index];
				}
				if (key === 'Escape') {
					reply = '';
				}
			}}
		/>
		<button class="prose-xl select-none px-2" type="submit">Send</button>
	</form>
</Window>

<style>
	button {
		@apply border-2 border-b-black border-l-white border-r-black border-t-white bg-[#bfb8bf];
	}
</style>
