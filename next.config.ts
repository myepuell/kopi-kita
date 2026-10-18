import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
