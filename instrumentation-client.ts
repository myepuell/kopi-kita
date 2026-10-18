// Dijalankan di browser sebelum halaman interaktif (Next.js >= 15.3).
// Semua kunci dibaca dari env (diisi di Vercel), tidak ada token di repo.
import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";
import { sentryOptions } from "@/lib/sentry-options";

Sentry.init(sentryOptions(process.env.NEXT_PUBLIC_VERCEL_ENV));

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: ".ph-mask",
    },
  });
}
