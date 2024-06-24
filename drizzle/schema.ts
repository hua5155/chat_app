import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const chat = pgTable('Chat', {
	id: text('id').primaryKey(),
	username: text('username').notNull(),
	message: text('message').notNull(),
	timestamp: timestamp('timestamp', { mode: 'date', withTimezone: false }).notNull().defaultNow()
});

const selectChatSchema = createSelectSchema(chat);
export type SelectChatSchema = z.infer<typeof selectChatSchema>;
