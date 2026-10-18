import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminCookieOptions } from '@/lib/admin-cookie';

// Cookie HttpOnly tidak bisa dihapus JavaScript, jadi logout lewat server.
export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set(ADMIN_COOKIE, '', adminCookieOptions(0));
  return response;
}
