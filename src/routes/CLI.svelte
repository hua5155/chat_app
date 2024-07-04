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

	function parseCommand(command: string) {
		if (command.startsWith('/help')) {
			for (let index = 0; index < COMMANDS.length; index++) {
				const command = COMMANDS[index];
				if (command.startsWith('/help')) {
					continue;
				}
				writeGrayLine(command);
			}
		} else if (command.startsWith('/about')) {
			writeGrayLine(`Just a chat app so I get to use DB and ORM.`);
			writeGrayLine(' ');
			writeGrayLine(
				'The app is built by SvelteKit, TailwindCSS, Drizzle ORM using Vercel Postgres and hosted on vercel.'
			);
			writeGrayLine(' ');
			writeGrayLine(
				'Chat is updated via polling DB from server side and sent to client using SSE.'
			);
		} else if (command.startsWith('/nickname')) {
			const newName = command.split(' ')[1];
			if (newName !== undefined) {
				$username = newName;
			} else {
				writeGrayLine(`Invalid arugment, expected name but got empty string.`);
			}
		} else {
			writeGrayLine(`Error parsing ${command}.`);
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
		'/nickname jeff to change your name in the chat.',
		'/help to see list of avaliable command.'
	] as const;
	const offset = PATH.length + $username.length;

	let userInput = '';
	let history: string[] = [''];
	let index = 0;
</script>

<Window windowName="Command Line" widthWithUnit="75ch" positonX={600} positonY={130}>
	<div class="w-full py-1">
		<div class="w-full border-2 border-b-white border-t-[#837c83]"></div>
	</div>
	<div
		class="prose-xl h-[400px] w-full max-w-none overflow-x-hidden overflow-y-scroll border-2 border-b-white border-l-black border-r-white border-t-black bg-black pl-2 text-[#7f787f] *:whitespace-pre *:text-wrap *:[overflow-anchor:none]"
		id="command-line"
		role="none"
		on:click={() => {
			// document.getElementById('user-input')?.focus();
		}}
	>
		{#each LOGO as line}
			<div class="leading-7">{line}</div>
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
