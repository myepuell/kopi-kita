import { Pool } from 'pg';

const globalForPg = globalThis as unknown as { pgPool?: Pool };

function createPool(): Pool {
  if (process.env.DATABASE_URL) {
    // Sertifikat database (Neon) wajib diverifikasi supaya koneksi tidak bisa disadap/dibelokkan (MITM).
    // Catatan: parameter sslmode di DATABASE_URL menimpa opsi ini; pakai sslmode=verify-full.
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: true,
      },
    });
  }

  return new Pool({
    user: process.env.DB_USER || 'kopikita',
    password: process.env.DB_PASSWORD || 'kopikita_secret',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    database: process.env.DB_NAME || 'kopikita',
  });
}

export const pool = globalForPg.pgPool || createPool();

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
}

export async function query(text: string, params?: any[]) {
  return await pool.query(text, params);
}
