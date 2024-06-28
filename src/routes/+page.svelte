<script lang="ts">
	import Chat from './Chat.svelte';
	import CLI from './CLI.svelte';
	import type { PageData } from './$types';
	import type { ChatSSE } from '$drizzle/schema';
	import { dev } from '$app/environment';
	import { enhance } from '$app/forms';
	import { onDestroy, onMount } from 'svelte';
	import { username } from './store';

	function getRandomNumber(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	async function handleEnter() {
		if ($username === '') {
			if (dev) console.log('Empty username');
			return;
		}
		if (reply === '') {
			if (dev) console.log('Empty message');
			return;
		}

		if (dev) console.log('POST /api/chat');
		await fetch('/api/chat', {
			method: 'POST',
			body: JSON.stringify({
				username: $username,
				message: reply
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		history.splice(1, 0, reply);
		index = 0;
		reply = '';
	}

	export let data: PageData;
	// if (dev) console.log(data.messages);
	$: chat = data.messages;
	let reply = '';
	let history: string[] = [''];
	let index = 0;

	onMount(() => {
		$username = `User${getRandomNumber(0, 9999)}`;

		const eventSource = new EventSource('/api/chat');
		eventSource.onmessage = (event) => {
			const eventData = JSON.parse(event.data) as ChatSSE[];
			const newMessages = eventData.map((value) => {
				const { timestamp, ...rest } = value;
				return { ...rest, timestamp: new Date(timestamp) };
			});
			console.log(`new messages: `, newMessages);
			data.messages = [...data.messages, ...newMessages];
		};

		return () => {
			eventSource.close();
		};
	});

	// onDestroy(() => {});
</script>

<main
	class="relative h-screen w-screen overflow-hidden bg-[#008080] font-['Source_Code_Pro','Noto_Sans_TC'] text-black"
>
	<Chat>
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

		<div slot="message" class="flex w-full flex-row gap-2">
			<input
				class="prose-xl grow border-2 border-b-white border-l-black border-r-white border-t-black px-2 focus:outline-none"
				type="text"
				name="message"
				autocomplete="off"
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
					if (key === 'Enter') {
						handleEnter();
					}
				}}
			/>
			<button
				class="prose-xl select-none px-2"
				on:click={() => {
					handleEnter();
				}}
			>
				Send
			</button>
		</div>
	</Chat>
	<CLI></CLI>
</main>

<style>
	button {
		@apply border-2 border-b-black border-l-white border-r-black border-t-white bg-[#bfb8bf];
	}
</style>
