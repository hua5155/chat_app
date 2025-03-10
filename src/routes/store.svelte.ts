function createUser(initialValue: string) {
    let username = $state(initialValue);

    return {
        get name() {
            return username;
        },
        set name(value) {
            username = value;
        }
    };
}

function createWindow(name: string, id: string) {
    let minimized = $state(true);
    let maximized = $state(false);

    return {
        get minimized() {
            return minimized;
        },
        set minimized(value) {
            minimized = value;
        },
        get maximized() {
            return maximized;
        },
        set maximized(value) {
            maximized = value;
        },
        get name() {
            return name;
        },
        get id() {
            return id;
        }
    };
}

function createZStack() {
    let stack: string[] = $state([]);

    return {
        get value() {
            return stack;
        },
        set value(value) {
            stack = value;
        }
    };
}

function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const user = createUser(`User${getRandomNumber(0, 9999)}`);
export const chatWindow = createWindow('Chat', 'chat-window');
export const cliWindow = createWindow('Command Line', 'cli-window');
export const windowStack = createZStack();
