const createUser = (initialValue: string) => {
    let username = $state(initialValue);

    return {
        get name() {
            return username;
        },
        set name(value) {
            username = value;
        }
    };
};

const createWindow = () => {
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
        }
    };
};

const createZStack = () => {
    let stack: string[] = $state([]);

    return {
        get value() {
            return stack;
        },
        set value(value) {
            stack = value;
        }
    };
};

function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const user = createUser(`User${getRandomNumber(0, 9999)}`);
export const chatWindow = createWindow();
export const cliWindow = createWindow();
export const windowStack = createZStack();
export const chatSetting = {
    name: 'Chat',
    id: 'chat-window'
};
export const cliSetting = {
    name: 'Command Line',
    id: 'cli-window'
};
