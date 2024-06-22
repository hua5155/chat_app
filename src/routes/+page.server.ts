import type { Actions, PageServerLoad } from './$types';
import { getDrizzleClient } from '$lib/server/drizzle';
import { chat } from '$drizzle/schema';
import { z } from 'zod';
import { nanoid } from 'nanoid';

const drizzle = getDrizzleClient();
export const load: PageServerLoad = async () => {
	const messages = await drizzle
		.select({
			username: chat.username,
			message: chat.message,
			timestamp: chat.timestamp
		})
		.from(chat)
		.limit(50);

	return { messages: messages };
};

export const actions: Actions = {
	postMessage: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		console.log(formData);

		const zParsed = z
			.object({
				username: z.string().min(1, 'username cannot be empty'),
				message: z.string().min(1, 'message cannot be empty')
			})
			.safeParse(formData);

		if (zParsed.success) {
			const { username, message } = zParsed.data;

			await drizzle.insert(chat).values({
				id: nanoid(),
				username: username,
				message: message,
				timestamp: new Date()
			});
		}
	}
};
