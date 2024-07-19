import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { getDrizzleClient } from '$lib/server/drizzle';
import { chat } from '$drizzle/schema';
import { z } from 'zod';
import { nanoid } from 'nanoid';

const drizzle = getDrizzleClient();

export const POST: RequestHandler = async ({ request }) => {
	if (dev) console.log('POST /api/chat');

	const requestBody = await request.json();
	if (dev) console.log(requestBody);

	const zParsed = z
		.object({
			username: z.string().min(1, 'username cannot be empty'),
			message: z.string().min(1, 'message cannot be empty')
		})
		.safeParse(requestBody);

	if (zParsed.success) {
		const { username, message } = zParsed.data;

		await drizzle.insert(chat).values({
			id: nanoid(),
			username: username,
			message: message
		});
	} else {
		if (dev) console.log(zParsed.error);
	}

	return new Response();
};
