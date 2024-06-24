<script lang="ts">
	import Chat from './Chat.svelte';
	import CLI from './CLI.svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { username } from './store';

	function getRandomNumber(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	export let data: PageData;
	// console.log(data.messages);
	$: timeline = data.messages;
	let reply = '';
	let history: string[] = [''];
	let index = 0;

	onMount(async () => {
		$username = `User${getRandomNumber(0, 9999)}`;

		// const response = await fetch('/api/update-message');
		// const body = await response.json();
		// console.log(body);
	});
</script>

<main class="relative h-screen w-screen overflow-hidden bg-[#008080] font-mono text-black">
	<Chat>
		{#each timeline as message (message.id)}
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

		<form
			slot="message"
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
				// console.log(formData);
				// cancel();

				// return async ({ result, update }) => {
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
					// console.log(key);

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
	</Chat>
	<CLI></CLI>
</main>

<style>
	button {
		@apply border-2 border-b-black border-l-white border-r-black border-t-white bg-[#bfb8bf];
	}
</style>
