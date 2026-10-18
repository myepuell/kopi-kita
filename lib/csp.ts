// Content-Security-Policy Kopi Kita. Dipasang per request oleh middleware.ts dengan nonce acak,
// sehingga hanya skrip milik Next.js (yang diberi nonce) dan skrip yang dimuatnya yang boleh jalan.
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
// posthog-js memuat skrip tambahan (mis. perekam replay) dari host aset: us.i.posthog.com -> us-assets.i.posthog.com
const posthogAssets = posthogHost.replace('.i.posthog.com', '-assets.i.posthog.com');

export function buildCsp(nonce: string, isDev: boolean): string {
  const directives = [
    "default-src 'self'",
    // 'strict-dynamic': skrip yang dimuat skrip ber-nonce (PostHog, Speed Insights) ikut diizinkan.
    // 'unsafe-eval' hanya di dev (React Refresh).
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    // Atribut style dari React/motion tidak bisa diberi nonce.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${posthogHost} ${posthogAssets} https://*.ingest.us.sentry.io https://*.ingest.sentry.io`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  return directives.join('; ');
}
