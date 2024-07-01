import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { buffer } from '$lib/server/store';

export const config = { runtime: 'edge' };

export const GET: RequestHandler = async ({ request }) => {
	if (dev) console.log(`GET request /api/chat`);

	const encoder = new TextEncoder();
	const readableStream = new ReadableStream({
		start(controller) {
			console.log('initial response');
			controller.enqueue(encoder.encode('event: subscribe\ndata: you have subscribe to chat!\n\n'));
		},
		async pull(controller) {
			console.log('waiting for buffer');
			await new Promise((resolve, reject) => {
				const unsubscribe = buffer.subscribe((messages) => {
					if (messages.length > 0) {
						unsubscribe();
						resolve(messages);
					}
				});
			})
				.then((message) => {
					console.log('enqueue message');
					if (dev) console.log(`enqueue message: ${JSON.stringify(message)}`);
					controller.enqueue(encoder.encode(`event: update\ndata: ${JSON.stringify(message)}\n\n`));
					buffer.update(() => []);
				})
				.catch((err) => {
					console.log('error', err);
				});
		},
		cancel() {
			console.log('cancel');
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
