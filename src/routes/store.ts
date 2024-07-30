import { get, writable } from 'svelte/store';

export const username = writable('');

export const chatSetting = {
    name: 'Chat',
    id: 'chat-window',
    visible: true
};
export const cliSetting = {
    name: 'Command Line',
    id: 'cli-window',
    visible: true
};
export const taskbar = writable({
    windows: [chatSetting, cliSetting],
    focus: ''
});
export const zStack = writable([chatSetting.name, cliSetting.name]);
