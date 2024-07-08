<script lang="ts">
	import Window from '$lib/component/Window.svelte';
	import { dev } from '$app/environment';
	import { username } from './store';
	import { scrollToBottom } from '$lib/util/ui';

	function writeGrayLine(text: string) {
		const parrent = document.getElementById('command-line');
		const child = document.getElementById('current-line');
		let newLine = document.createElement('div');
		newLine.innerText = text;
		parrent?.insertBefore(newLine, child);
	}
	function writeWhiteLine(text: string) {
		const parrent = document.getElementById('command-line');
		const child = document.getElementById('current-line');
		let newLine = document.createElement('div');
		newLine.innerText = text;
		newLine.classList.add('text-white');
		parrent?.insertBefore(newLine, child);
	}

	function parseCommand(input: string) {
		const command = input.split(' ')[0];

		if (dev) console.log(`${input}`);

		if (command === '/help') {
			for (let index = 0; index < COMMANDS.length; index++) {
				const command = COMMANDS[index];
				if (command.startsWith('/help')) {
					continue;
				}
				writeGrayLine(command);
			}
		} else if (command === '/about') {
			writeGrayLine(
				"Just a Windows 95 styled messaging app so I get to practice backend related things(API, DB, ORM), and doing some frontend that's not copying some other website."
			);
			writeGrayLine(' ');
			writeGrayLine(
				'The app is built by SvelteKit, TailwindCSS, Drizzle ORM using Vercel Postgres and hosted on vercel.'
			);
			writeGrayLine(' ');
			writeGrayLine(
				'Chat is updated by polling DB with filtering query based on last known row from server side and sent to client via SSE.'
			);
			writeGrayLine(
				"This is a very rough workaround that I can't share data between API request(and probably shouldn't), I might tryout Supabase later."
			);
		} else if (command === '/nickname') {
			const start = input.indexOf('"') + 1;
			const end = input.indexOf('"', start);
			const newName = input.substring(start, end);

			if (newName === '') {
				writeGrayLine('Invalid argument, expect "my name" but got none.');
				return;
			}
			$username = newName;
		} else {
			writeGrayLine(`Error parsing ${input}.`);
			writeGrayLine('Type /help to see list of avaliable command.');
		}
	}

	//    ________          __
	//   / ____/ /_  ____ _/ /_   ____ _____  ____
	//  / /   / __ \/ __ `/ __/  / __ `/ __ \/ __ \
	// / /___/ / / / /_/ / /_   / /_/ / /_/ / /_/ /
	// \____/_/ /_/\__,_/\__/   \__,_/ .___/ .___/
	//                              /_/   /_/
	const LOGO = [
		'   ________          __                     ',
		'  / ____/ /_  ____ _/ /_   ____ _____  ____ ',
		' / /   / __ \\/ __ `/ __/  / __ `/ __ \\/ __ \\',
		'/ /___/ / / / /_/ / /_   / /_/ / /_/ / /_/ /',
		'\\____/_/ /_/\\__,_/\\__/   \\__,_/ .___/ .___/ ',
		'                             /_/   /_/      '
	] as const;

	const PATH = 'C:/User/' as const;
	const COMMANDS = [
		'/about to know more about the app.',
		'/nickname "your name" to change your name in the chat.',
		'/help to see list of avaliable command.'
	] as const;

	let userInput = '';
	let history: string[] = [''];
	let index = 0;
</script>

<Window windowName="Command Line" widthWithUnit="75ch" positonX={290} positonY={210}>
	<div
		class="prose-xl h-[400px] w-full overflow-x-hidden overflow-y-scroll border-2 border-b-white border-l-black border-r-white border-t-black bg-black pl-2 text-[#7f787f] *:whitespace-pre *:text-wrap *:[overflow-anchor:none]"
		id="command-line"
		role="none"
		on:click={() => {
			// document.getElementById('user-input')?.focus();
		}}
	>
		{#each LOGO as line}
			<div class="text-base leading-snug">{line}</div>
		{/each}

		{#each COMMANDS as command}
			<div>{command}</div>
		{/each}

		<div class="inline-flex w-full text-white" id="current-line">
			<span class="w-fit pr-[1ch]">{`${PATH}${$username}>`}</span>
			<input
				class="h-fit w-[35ch] bg-black focus:outline-none"
				type="text"
				id="user-input"
				bind:value={userInput}
				on:keydown={({ key }) => {
					// if (dev) console.log(key);

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
						index = 0;
					}
					if (key === 'Enter') {
						userInput = userInput.trimEnd();
						writeWhiteLine(`${PATH}${$username}> ${userInput}`);
						history = history.toSpliced(1, 0, userInput);
						index = 0;
						parseCommand(userInput);
						userInput = '';
					}
					scrollToBottom(document.getElementById('command-line'));
				}}
			/>
		</div>
		<div class="h-[1px] [overflow-anchor:auto_!important]"></div>
	</div>
</Window>

<style>
	button {
		@apply border-2 border-b-black border-l-white border-r-black border-t-white bg-[#bfb8bf];
	}
</style>
