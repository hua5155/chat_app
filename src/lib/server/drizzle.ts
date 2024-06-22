import { drizzle as orm } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

process.env.POSTGRES_URL = POSTGRES_URL;

const drizzle = orm(sql);
export const getDrizzleClient = () => {
	return drizzle;
};
