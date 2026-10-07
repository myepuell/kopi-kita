import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const user = process.env.DB_USER || 'kopikita';
const password = process.env.DB_PASSWORD || 'kopikita_secret';
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5433', 10);
const database = process.env.DB_NAME || 'kopikita';

export const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : { user, password, host, port, database }
);

export async function query(text: string, params?: any[]) {
  return await pool.query(text, params);
}
