# Todo
- [ ] ~~Move timestamp from server side to client side?~~
    - Stick with server time, for single source of truth.
- [ ] ~~Change from timestamp from ISO 8601 to Unix time?~~
    - Stick with ISO8601 for human readability.
- [x] Update chat
- [x] Try using supabase and update using websocket?
- [ ] More CLI commands
- [x] Better command parsing
- [ ] Task bar

[ASCII art generator](https://patorjk.com/software/taag/)
[Windows 95 icon viwer](https://win98icons.alexmeub.com/)
[Windwos 95 emulator](https://www.pcjs.org/software/pcx86/sys/windows/win95/4.00.950/)

---

# Issues
## `<input>` loss focus after form submit
But `document.activeElement` return `<input>`.

Right now using `autofocus` as bandaid fix.

## SSE issue
API route run in node runtime by default. and need to complete API request within 10 sec. (Hobby plan limit)
While Edge runtime doesn't have limit on duration. just need to make sure API respond within 25 sec, cannot use more than 128MB of memory.

1. SSE work on `pnpm run dev` & `vercel dev`
2. ~~Vercel runtime log `TypeError: This ReadableStream did not return bytes.`~~
    Runtime can't auto encode, solved by encode before enqueue.

    1. Firefox API respond `Firefox can’t establish a connection to the server at https://chat-app-lake-eta.vercel.app/api/chat.`
    2. Brave API respond `EventSource's response has a MIME type ("text/plain") that is not "text/event-stream". Aborting the connection.`
3. `ReadableStream`'s `pull()` will freeze if I don't enqueue stuff??

---

# How to update chat
## ~~Client side polling~~ (hell no)
Probably the dumbest way.

- Pros
    - Easy to implement.
- Cons
    - Wasting bandwidth.
    - Using `invalidate()` will cause chat losing history beyond 50 messages.

## Server side polling + SSE (Server Sent Event)
Polling DB with filtering query based on last known identifiers.

- Pros
    - Optimal for Vercel Edge Function.
- Cons
    - Still polling DB

## ~~Buffer + SSE~~
By using Svelte writable in a server side `store.ts` to create a buffer will probably eliminated the need to polling DB for new messages.
Just use the returned row when inserting into the buffer, then subscribe to it in the SSE API.

- Pros
    - Less DB traffic.
- Cons
    - Probably don't work on serverless.

## WebSocket
Supabase provided Postgres along with WebSocket API.

- Pros
    - Bi-directional data transfer.
    - Supbase is FOSS and can be self hosted.
- Cons
    - Haven't thought of any.

# Task bar
## stores needed
1. state of each window
    - visibility
2. who is in focus
    - Window name?
3. z height
    - array order?
4. task bar order
    - array order?

## update focus, visibility, z height
1. update window states inside `Window.svelte` by passing binded store from `Chat.svelte`, `CLI.svelte`, etc ?
2. update task bar order 

- taskbar items
    1. change visibility
    2. change focus
    3. change z height
- window close button
    1. change visibility
    2. remove from taskbar store
- window minimize button
    1. change visibility
    2. change focus
