<script lang="ts">
    import Chat from './Chat.svelte';
    import CLI from './CLI.svelte';
    import Taskbar from './Taskbar.svelte';
    import Icon from './Icon.svelte';
    import { dev } from '$app/environment';
    import { user, chatWindow, cliWindow, taskbar } from './store.svelte';
    import { setFocus } from '$lib/util/ui';

    let { data = $bindable() } = $props();
    // if (dev) console.log(data.messages);

    if (dev) console.log(`Username: ${user.name}`);
</script>

<main
    class="relative h-dvh w-dvw overflow-hidden bg-[#008080] p-5 font-['Source_Code_Pro','Noto_Sans_TC'] text-black"
>
    <div
        class="grid h-fit w-full grid-flow-col justify-items-center *:select-none xl:w-fit xl:grid-flow-row"
    >
        <Icon
            src="/icon/chat.png"
            iconName="Chat"
            ondblclick={() => {
                taskbar.windows.add(chatWindow);
                chatWindow.minimized = false;
                setTimeout(() => {
                    setFocus(chatWindow.id);
                }, 0);
            }}
        ></Icon>
        <Icon
            src="/icon/cli.png"
            iconName="CLI"
            ondblclick={() => {
                taskbar.windows.add(cliWindow);
                cliWindow.minimized = false;
                setTimeout(() => {
                    setFocus(cliWindow.id);
                }, 0);
            }}
        ></Icon>
        <div class="relative">
            <a
                href="https://github.com/hua5155/chat_app"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    class="w-[100px]"
                    src="/icon/github.png"
                    alt=""
                    ondragstart={(event) => {
                        event.preventDefault();
                    }}
                />
            </a>
            <p class="absolute bottom-0 left-1/2 -translate-x-1/2 text-white">GitHub</p>
        </div>
    </div>
    <Chat bind:chat={data.messages}></Chat>
    <CLI></CLI>
    <Taskbar></Taskbar>
</main>

<style>
</style>
