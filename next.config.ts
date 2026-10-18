import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Header keamanan untuk semua respons. CSP (butuh nonce per request) dipasang di middleware.ts.
  // HSTS sudah dikirim Vercel untuk domain *.vercel.app.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          // Isolasi lintas-origin (Spectre): jendela lain tidak bisa memegang referensi ke halaman ini,
          // dan sumber daya kita tidak bisa disematkan situs lain. COEP "credentialless" (bukan
          // "require-corp") karena skrip PostHog dari us-assets.i.posthog.com tidak mengirim header CORP.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

// Source map diunggah ke Sentry saat build supaya stack trace menunjuk file asli.
// SENTRY_ORG, SENTRY_PROJECT, dan SENTRY_AUTH_TOKEN hanya diisi di Vercel (tidak pernah di repo).
// Tanpa token, build tetap jalan, hanya tanpa unggah source map.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  silent: !process.env.CI,
});
