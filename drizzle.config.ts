import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './drizzle/schema.ts', // schema folder.
	out: './drizzle/migrations/', // migration file output.
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.SUPABASE_POSTGRES_URL ?? ''
	}
});
