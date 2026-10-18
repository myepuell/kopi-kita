import { NextResponse, type NextRequest } from 'next/server';
import { buildCsp } from '@/lib/csp';

// CSP dengan nonce baru di setiap request. Next.js membaca nonce dari header CSP request
// dan memasangnya ke semua <script> miliknya (halaman wajib dirender dinamis, lihat app/layout.tsx).
export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce, process.env.NODE_ENV === 'development');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Halaman saja: API (JSON), aset statis, dan prefetch tidak butuh CSP.
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
