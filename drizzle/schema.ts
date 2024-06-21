import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const chat = pgTable('Chat', {
	id: text('id').primaryKey(),
	username: text('username').notNull(),
	message: text('message').notNull(),
	timestamp: timestamp('timestamp').notNull().defaultNow()
});
