import type { Actions, PageServerLoad } from './$types';
import { getDrizzleClient } from '$lib/server/drizzle';
import { asc, desc } from 'drizzle-orm';
import { chat } from '$drizzle/schema';
import { z } from 'zod';
import { nanoid } from 'nanoid';

const drizzle = getDrizzleClient();
export const load: PageServerLoad = async () => {
	const lastFiftyRows = drizzle
		.select()
		.from(chat)
		.orderBy(desc(chat.timestamp))
		.limit(50)
		.as('subquery');
	const ascendingOrdered = await drizzle
		.select()
		.from(lastFiftyRows)
		.orderBy(asc(lastFiftyRows.timestamp));

	return { messages: ascendingOrdered };
};

export const actions: Actions = {
	sendMessage: async ({ request }) => {
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
			const ISOTime = new Date().toISOString();
			console.log(ISOTime);

			await drizzle.insert(chat).values({
				id: nanoid(),
				username: username,
				message: message,
				timestamp: new Date(ISOTime)
			});
		} else {
			console.log(zParsed.error);
		}
	}
};
