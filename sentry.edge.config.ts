// Sentry untuk runtime edge (middleware/route edge). Dimuat dari instrumentation.ts.
import * as Sentry from "@sentry/nextjs";
import { sentryOptions } from "@/lib/sentry-options";

Sentry.init(sentryOptions(process.env.VERCEL_ENV));
