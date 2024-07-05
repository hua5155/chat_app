# Todo
- [ ] ~~Move timestamp from server side to client side?~~
    - Stick with server time, for single source of truth.
- [ ] ~~Change from timestamp from ISO 8601 to Unix time?~~
    - Stick with ISO8601 for human readability.
- [x] Update chat
- [x] ASCII art inside CLI
- [ ] More CLI commands
- [ ] Better command parsing

[ASCII art generator](https://patorjk.com/software/taag/)

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
- Vercel recommended solutions:
    - Ably
    - Convex
    - Liveblocks
    - Partykit
    - Pusher
    - PubNub
    - TalkJS
    - SendBird

- Pros
    - Bi-directional data transfer.
- Cons
    - Need 3rd party service on serverless.
