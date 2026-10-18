// Opsi Sentry yang sama untuk browser, server, dan edge.
// DSN dibaca dari env (diisi di Vercel); tanpa DSN Sentry tidak mengirim apa pun.
export function sentryOptions(environment: string | undefined) {
  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    // Vercel: "preview" untuk deployment branch, "production" untuk main.
    environment: environment || process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
    // Data tamu (nama, WhatsApp, catatan booking) tidak boleh terkirim ke Sentry. Bawaan SDK v11 ikut
    // mengirim isi body request, cookie, query, nilai parameter query database, dan variabel lokal stack trace.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpBodies: [],
      urlQueryParams: false,
      databaseQueryData: false,
      stackFrameVariables: false,
    },
  };
}
