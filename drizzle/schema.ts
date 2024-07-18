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

const chatServerLoad = selectChatSchema.omit({ id: true });
export type ChatServerLoad = z.infer<typeof chatServerLoad>;

const chatWebSocket = selectChatSchema.extend({ timestamp: z.string() }).omit({ id: true });
export type ChatWebSocket = z.infer<typeof chatWebSocket>;
