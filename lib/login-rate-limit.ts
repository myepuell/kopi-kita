import type { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { LOGIN_FAILURES_DDL } from '@/lib/login-failures-schema';

// Batas percobaan login admin per alamat IP: setelah 5 kali gagal dalam 15 menit, login ditolak (429)
// sampai 15 menit sejak kegagalan ke-5 terakhir. Disimpan di Postgres, bukan memori, karena Vercel
// menjalankan beberapa instance serverless yang tidak berbagi memori.
export const MAX_FAILED_LOGINS = 5;
const WINDOW_MINUTES = 15;

// Tabel dibuat otomatis sekali per instance, supaya database production tidak perlu migrasi manual.
let tableReady: Promise<unknown> | null = null;
function ensureTable() {
  tableReady ??= query(LOGIN_FAILURES_DDL).catch((error) => {
    tableReady = null;
    throw error;
  });
  return tableReady;
}

// Di Vercel, x-forwarded-for diisi edge Vercel (nilai dari klien tidak dipercaya mentah-mentah),
// dan alamat pertama adalah IP pengunjung.
export function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || req.headers.get('x-real-ip') || 'unknown';
}

// Detik sampai boleh mencoba lagi, atau 0 kalau belum terkena batas.
export async function loginRetryAfterSeconds(ip: string): Promise<number> {
  await ensureTable();
  const result = await query(
    `SELECT CEIL(EXTRACT(EPOCH FROM (created_at + make_interval(mins => $2) - now())))::int AS wait
       FROM login_failures
      WHERE ip = $1 AND created_at > now() - make_interval(mins => $2)
      ORDER BY created_at DESC
      OFFSET $3 LIMIT 1`,
    [ip, WINDOW_MINUTES, MAX_FAILED_LOGINS - 1]
  );
  return result.rows.length > 0 ? Math.max(1, result.rows[0].wait) : 0;
}

export async function recordFailedLogin(ip: string): Promise<void> {
  await ensureTable();
  await query('INSERT INTO login_failures (ip) VALUES ($1)', [ip]);
  // Bersihkan catatan lama supaya tabel tetap kecil.
  await query("DELETE FROM login_failures WHERE created_at < now() - interval '1 day'");
}

export async function clearFailedLogins(ip: string): Promise<void> {
  await ensureTable();
  await query('DELETE FROM login_failures WHERE ip = $1', [ip]);
}
