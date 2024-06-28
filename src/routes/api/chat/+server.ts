import type { RequestHandler } from './$types';
import type { SelectChatSchema } from '$drizzle/schema';
import { writable } from 'svelte/store';
import { getDrizzleClient } from '$lib/server/drizzle';
import { chat } from '$drizzle/schema';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { dev } from '$app/environment';

export const config = { runtime: 'edge' };

const buffer = writable<SelectChatSchema[]>([]);
const drizzle = getDrizzleClient();

export const GET: RequestHandler = async ({ request }) => {
	if (dev) console.log(`GET request /api/chat`);

	const encoder = new TextEncoder();
	const readableStream = new ReadableStream({
		start(controller) {
			controller.enqueue(encoder.encode('event: subscribe\ndata: you have subscribe to chat!\n\n'));
		},
		async pull(controller) {
			await new Promise((resolve, reject) => {
				const unsubscribe = buffer.subscribe((messages) => {
					if (messages.length > 0) {
						unsubscribe();
						resolve(messages);
					}
				});
			}).then((message) => {
				if (dev) console.log(`enqueue message: ${JSON.stringify(message)}`);
				controller.enqueue(encoder.encode(`event: update\ndata: ${JSON.stringify(message)}\n\n`));
				buffer.update(() => []);
			});
		}
	});

	return new Response(readableStream, {
		headers: {
			'cache-control': 'no-cache',
			'content-type': 'text/event-stream',
			connection: 'keep-alive'
		}
	});
};

export const POST: RequestHandler = async ({ request }) => {
	if (dev) console.log(`POST request /api/chat`);

	const zParsed = z
		.object({
			username: z.string().min(1, 'username cannot be empty'),
			message: z.string().min(1, 'message cannot be empty')
		})
		.safeParse(await request.json());

	if (zParsed.success) {
		const { username, message } = zParsed.data;

		const row = await drizzle
			.insert(chat)
			.values({
				id: nanoid(),
				username: username,
				message: message
			})
			.returning();

		buffer.update((value) => {
			if (dev) console.log(row);
			return [...value, ...row];
		});
	} else {
		if (dev) console.log(zParsed.error);
	}

	return new Response();
};
