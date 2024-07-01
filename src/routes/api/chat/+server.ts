import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { getDrizzleClient } from '$lib/server/drizzle';
import { asc, desc, and, gt, ne } from 'drizzle-orm';
import { chat } from '$drizzle/schema';

export const config = { runtime: 'edge' };

const drizzle = getDrizzleClient();
let lastId: string;
let lastTimestamp: Date;

export const GET: RequestHandler = async ({ request }) => {
	if (dev) console.log(`GET request /api/chat`);

	const encoder = new TextEncoder();
	const readableStream = new ReadableStream({
		async start(controller) {
			console.log('initial response');

			const lastRow = await drizzle
				.select({
					id: chat.id,
					timestamp: chat.timestamp
				})
				.from(chat)
				.orderBy(desc(chat.timestamp))
				.limit(1);

			lastId = lastRow[0].id;
			lastTimestamp = lastRow[0].timestamp;

			controller.enqueue(encoder.encode(`event: start\ndata: SSE established\n\n`));
		},
		async pull(controller) {
			await new Promise((resolve) => {
				setTimeout(resolve, 1000);
			});

			console.log('checking for update');
			console.log(`lastId: ${lastId}`);
			console.log(`lastTimestamp: ${lastTimestamp}`);

			try {
				const newRows = await drizzle
					.select()
					.from(chat)
					.where(
						lastTimestamp && lastId
							? and(gt(chat.timestamp, lastTimestamp), ne(chat.id, lastId))
							: undefined
					)
					.orderBy(asc(chat.timestamp));

				console.log('newRows:');
				console.log(newRows);

				if (newRows.length !== 0) {
					lastId = newRows[newRows.length - 1].id;
					lastTimestamp = newRows[newRows.length - 1].timestamp;
				}

				controller.enqueue(encoder.encode(`event: pull\ndata: ${JSON.stringify(newRows)}\n\n`));
			} catch (err) {
				console.log(err);
			}
		},
		cancel() {
			console.log('connection closed');
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
