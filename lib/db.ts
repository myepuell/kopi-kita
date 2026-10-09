import { Pool } from 'pg';

const globalForPg = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForPg.pgPool ||
  new Pool(
    process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : {
          user: process.env.DB_USER || 'kopikita',
          password: process.env.DB_PASSWORD || 'kopikita_secret',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5433', 10),
          database: process.env.DB_NAME || 'kopikita',
        }
  );

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
}

export async function query(text: string, params?: any[]) {
  return await pool.query(text, params);
}
