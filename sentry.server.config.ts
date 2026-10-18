// Sentry untuk kode server (route handler /api/*, render server). Dimuat dari instrumentation.ts.
import * as Sentry from "@sentry/nextjs";
import { sentryOptions } from "@/lib/sentry-options";

Sentry.init(sentryOptions(process.env.VERCEL_ENV));
