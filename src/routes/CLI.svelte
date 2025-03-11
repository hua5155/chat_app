<script lang="ts">
    import Window from '$lib/component/Window.svelte';
    import { dev } from '$app/environment';
    import { user, cliWindow, windowStack, taskbar } from './store.svelte';
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
                'A Windows 95 styled messaging app to practice backend related things(API, DB, ORM, WebSocket, SSE).'
            );
            writeGrayLine(' ');
            writeGrayLine(
                "The app is built by SvelteKit, TailwindCSS, Drizzle ORM using Supbase's PostgreSQL and hosted on Vercel."
            );
            writeGrayLine(' ');
            writeGrayLine("Chat is updated by client-to-client WebSocket using Supabase's API.");
        } else if (command === '/nickname') {
            const start = input.indexOf('"') + 1;
            const end = input.indexOf('"', start);
            const newName = input.substring(start, end);

            if (newName === '') {
                writeGrayLine('Invalid argument, expect "my name" but got none.');
                return;
            }
            user.name = newName;
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

    let userInput = $state('');
    let history: string[] = $state(['']);
    let index = $state(0);

    let zHeight = $derived(windowStack.value.findIndex((name) => name === cliWindow.name));
</script>

<Window
    windowName={cliWindow.name}
    id={cliWindow.id}
    widthWithUnit="75ch"
    positonX={290}
    positonY={210}
    {zHeight}
    bind:minimized={cliWindow.minimized}
    onfocusin={() => {
        taskbar.focus = cliWindow.name;

        const rest = windowStack.value.filter((name) => name !== cliWindow.name);
        windowStack.value = [...rest, cliWindow.name];
    }}
    onfocusout={() => {
        taskbar.focus = '';
    }}
    onclose={() => {
        taskbar.windows.delete(cliWindow);
    }}
>
    <div
        class="prose-lg w-full flex-grow overflow-x-clip overflow-y-scroll border-2 border-b-white border-l-black border-r-white border-t-black bg-black pl-2 text-[#7f787f] xl:prose-xl *:whitespace-pre *:text-wrap *:[overflow-anchor:none] xl:h-[11lh]"
        id="command-line"
        role="none"
        onclick={() => {
            // document.getElementById('user-input')?.focus();
        }}
    >
        {#each LOGO as line}
            <div class="text-xs leading-snug xl:text-base">{line}</div>
        {/each}

        {#each COMMANDS as command}
            <div>{command}</div>
        {/each}

        <div
            class="flex w-full flex-col text-white xl:flex-row"
            id="current-line"
        >
            <span>{`${PATH}${user.name}`}</span>
            <span class="hidden xl:inline">{'> '}</span>
            <div class="flex flex-grow flex-row">
                <span class="xl:hidden">{'> '}</span>
                <input
                    class="h-fit flex-grow bg-black focus:outline-none"
                    type="text"
                    autocomplete="off"
                    id="user-input"
                    bind:value={userInput}
                    onkeydown={({ key }) => {
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
                            writeWhiteLine(`${PATH}${user.name}> ${userInput}`);
                            history = history.toSpliced(1, 0, userInput);
                            index = 0;
                            parseCommand(userInput);
                            userInput = '';
                        }
                        scrollToBottom(document.getElementById('command-line'));
                    }}
                />
            </div>
        </div>
        <div class="h-[1px] ![overflow-anchor:auto]"></div>
    </div>
</Window>

<style>
</style>
