import type { Config } from 'drizzle-kit';
export default {
	dialect: 'postgresql',
	out: './drizzle/migrations/', // migration file output.
	schema: './drizzle/schema.ts', // schema folder.
	breakpoints: false // true for MySQL or SQLite.
} satisfies Config;
