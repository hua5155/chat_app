<script lang="ts">
	import Window from '$lib/component/Window.svelte';
	import { dev } from '$app/environment';
	import { username } from './store';
	import { scrollToBottom } from '$lib/util/ui';

	function writeLine(text: string, classes: string[]) {
		const parrent = document.getElementById('command-line');
		const child = document.getElementById('current-line');
		let newLine = document.createElement('div');
		newLine.innerText = text;
		newLine.classList.add(...classes);
		parrent?.insertBefore(newLine, child);
	}

	function handleEnter() {
		userInput = userInput.trimEnd();

		if (userInput === '') {
		} else if (userInput === '/help') {
			writeLine(`${RENAME} to change your name in the chat`, ['text-[#7f787f]', 'pl-[4ch]']);
		} else if (userInput.startsWith('/nickname')) {
			const newName = userInput.split(' ')[1];
			$username = newName;
		} else {
			writeLine(`Error parsing ${userInput}.`, ['text-[#7f787f]', 'pl-[4ch]']);
			writeLine('Type /help to see list of avaliable command', ['text-[#7f787f]', 'pl-[4ch]']);
		}

		lines = [...lines, `${PATH}${$username}> ${userInput}`];
		history.splice(1, 0, userInput);
		history = history;
		index = 0;
		userInput = '';
	}

	const PATH = 'C:/User/' as const;
	const RENAME = '/nickname jeff' as const;
	const offset = PATH.length + $username.length;

	let lines: string[] = [];
	let userInput = '';
	let history: string[] = [''];
	let index = 0;
</script>

<Window positonX={600} positonY={130} windowName="Command Line">
	<div class="w-full py-1">
		<div class="w-full border-2 border-b-white border-t-[#837c83]"></div>
	</div>
	<div
		class="prose-xl h-96 w-full max-w-none overflow-y-scroll border-2 border-b-white border-l-black border-r-white border-t-black bg-black pl-2 text-white"
		id="command-line"
		role="none"
		on:click={() => {
			document.getElementById('user-input')?.focus();
		}}
	>
		<div class="text-[#7f787f] [overflow-anchor:none]">
			{`${RENAME} to change your name in the chat`}
		</div>
		<div class="text-[#7f787f] [overflow-anchor:none]">/help to see list of avaliable command</div>
		{#each lines as line}
			<div class="[overflow-anchor:none]">{line}</div>
		{/each}
		<div class="inline-flex w-full [overflow-anchor:none]" id="current-line">
			<span class="w-fit pr-[1ch]">{`${PATH}${$username}>`}</span>
			<input
				class="h-fit w-[35ch] bg-black focus:outline-none"
				type="text"
				id="user-input"
				bind:value={userInput}
				on:keydown={({ key }) => {
					if (dev) console.log(key);

					if (key === 'ArrowUp') {
						index += 1;
						if (index > history.length - 1) {
							index = history.length - 1;
						}
						userInput = history[index];
					}
					if (key === 'ArrowDown') {
						index -= 1;
						if (index < 0) {
							index = 0;
						}
						userInput = history[index];
					}
					if (key === 'Escape') {
						userInput = '';
					}
					if (key === 'Enter') {
						handleEnter();
						scrollToBottom(document.getElementById('command-line'));
					}
				}}
			/>
		</div>
		<div class="h-[1px] [overflow-anchor:auto]"></div>
	</div>
</Window>

<style>
	button {
		@apply border-2 border-b-black border-l-white border-r-black border-t-white bg-[#bfb8bf];
	}
</style>
