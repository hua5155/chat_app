import { drizzle as orm } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';

const drizzle = orm(sql);
export const getDrizzleClient = () => {
	return drizzle;
};
