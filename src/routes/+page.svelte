<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	function getRandomNumber(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	export let data: PageData;
	let timeline = data.messages;
	let form: HTMLFormElement;
	let username = `username${getRandomNumber(0, 9999)}`;
	let reply = '';
	let history: string[] = [''];
	let index = 0;
</script>

<main class="h-screen w-screen overflow-hidden bg-[#008080] p-20 font-mono text-black">
	<div
		class="w-1/3 border-2 border-b-black border-l-white border-r-black border-t-white bg-[#c0c0c0] p-1"
	>
		<div class="flex w-full flex-row gap-2 bg-[#00007f] p-1 font-bold">
			<p class="prose grow px-2 text-white">Chat</p>
			<button class="h-7 w-7 text-center align-middle">-</button>
			<button class="h-7 w-7 text-center align-middle">+</button>
			<button class="h-7 w-7 text-center align-middle">x</button>
		</div>
		<div class="w-full pt-1"></div>
		<div class="w-full border-2 border-b-white border-t-[#837c83]"></div>
		<div class="w-full pb-1"></div>
		<ul
			class="prose-xl h-96 w-full max-w-none overflow-y-scroll border-2 border-b-white border-l-black border-r-white border-t-black bg-white"
		>
			{#each timeline as message}
				<li class="m-0 flex flex-row text-pretty leading-7">
					<p class="m-0 grow pl-8 -indent-8">
						<span class="text-[#0000ff]">{`<${message.username}> `}</span>
						{message.message}
					</p>
					<p class="m-0 shrink-0 pl-4 pr-2 text-[#7f787f]">
						{message.timestamp.toLocaleTimeString()}
					</p>
				</li>
			{/each}
		</ul>
		<div class="w-full pt-1"></div>
		<form
			class="flex w-full flex-row gap-2"
			action="?/postMessage"
			method="post"
			bind:this={form}
			use:enhance={({ formData, cancel }) => {
				if (username === '') {
					console.log('Empty username');
					cancel();
				}
				if (reply === '') {
					console.log('Empty message');
					cancel();
				}

				const timestamp = new Date();
				const message = {
					username: username,
					message: reply,
					timestamp: timestamp
				};

				timeline = [...timeline, message];
				history.splice(1, 0, reply);
				index = 0;
				reply = '';

				formData.append('username', message.username);
				formData.append('timestamp', timestamp.toString());
				console.log(formData);
				// cancel();
			}}
		>
			<input
				class="prose-xl grow border-2 border-b-white border-l-black border-r-white border-t-black px-2 focus:outline-none"
				type="text"
				name="message"
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
			<button class="prose-xl px-2" type="submit">Send</button>
		</form>
	</div>
</main>

<style>
	button {
		@apply border-2 border-b-black border-l-white border-r-black border-t-white bg-[#bfb8bf];
	}
</style>
