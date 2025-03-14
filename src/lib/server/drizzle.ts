import { drizzle as orm } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { SUPABASE_POSTGRES_URL } from '$env/static/private';

const client = postgres(SUPABASE_POSTGRES_URL);
const drizzle = orm(client);
export const getDrizzleClient = () => {
    return drizzle;
};
