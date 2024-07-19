import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { getDrizzleClient } from '$lib/server/drizzle';
import { asc, desc } from 'drizzle-orm';
import { chat } from '$drizzle/schema';

const drizzle = getDrizzleClient();

export const load: PageServerLoad = async () => {
	const lastFiftyRows = drizzle
		.select({
			username: chat.username,
			message: chat.message,
			timestamp: chat.timestamp
		})
		.from(chat)
		.orderBy(desc(chat.timestamp))
		.limit(50)
		.as('subquery');
	const ascendingOrdered = await drizzle
		.select()
		.from(lastFiftyRows)
		.orderBy(asc(lastFiftyRows.timestamp));

	// if (dev) console.log(ascendingOrdered);

	return { messages: ascendingOrdered };
};
