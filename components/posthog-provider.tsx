"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// posthog.init ada di instrumentation-client.ts. Provider ini hanya membagikan instance
// ke hook React (mis. useFeatureFlagVariantKey untuk flag cta-landing).
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
