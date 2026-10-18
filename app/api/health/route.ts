import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

// Untuk uptime monitor: aplikasi hidup + database bisa dijangkau.
// Respons sengaja hanya {"status": ...}, tanpa nama host, versi, atau pesan error database.
export async function GET() {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      query('SELECT 1'),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('database tidak merespons dalam 5 detik')), 5000);
      }),
    ]);
    return NextResponse.json({ status: 'ok' }, { headers: NO_STORE });
  } catch (error) {
    // Hanya di log server. Error koneksi (AggregateError) pesannya kosong, jadi pakai kodenya (mis. ECONNREFUSED).
    const reason = error instanceof Error ? error.message || (error as NodeJS.ErrnoException).code || error.name : error;
    console.error('Health check gagal:', reason);
    return NextResponse.json({ status: 'error' }, { status: 503, headers: NO_STORE });
  } finally {
    clearTimeout(timer);
  }
}
