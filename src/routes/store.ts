import { writable } from 'svelte/store';

export const username = writable('');

export const chatSetting = {
    name: 'Chat',
    id: 'chat-window'
};
export const cliSetting = {
    name: 'Command Line',
    id: 'cli-window'
};
export const taskbar = writable({
    windows: [chatSetting, cliSetting],
    focus: ''
});
