# Kopi Kita Monitoring

Production: https://kopi-kita-eight.vercel.app

| Alat | Untuk apa | Di kode |
|---|---|---|
| Sentry | Error di browser & server, stack trace ke file asli (source map) | `instrumentation-client.ts`, `instrumentation.ts`, `sentry.*.config.ts`, `app/global-error.tsx`, `next.config.ts` |
| `/api/health` + UptimeRobot | Cek situs & database tiap beberapa menit, kirim email kalau mati | `app/api/health/route.ts` |
| Vercel Speed Insights | Skor performa dari pengunjung nyata (RES) | `<SpeedInsights />` di `app/layout.tsx` |
| PostHog | Tetap jalan setelah Sentry dipasang: `posthog.init` ada di `instrumentation-client.ts` | `instrumentation-client.ts` |

> Bagian bertanda **BELUM ADA** diisi setelah langkahnya benar-benar dilakukan. Jangan diisi dengan ID, link, atau angka perkiraan.

---

## 1. Error-to-fix flow

- **Bug latihan:** BELUM ADA (apa bugnya dan di halaman mana).
- **Branch & preview:** branch `latihan/sentry-bug`, preview URL: BELUM ADA. Bug ini hanya ada di branch dan preview tersebut, tidak pernah di-merge ke `main`.
- **Sentry issue:** ID BELUM ADA, link: BELUM ADA

  ![Sentry issue dengan stack trace](docs/monitoring/1_sentry_issue_stack_trace.png)

- **Akar masalah:** BELUM ADA (1–2 kalimat, sesuai baris yang ditunjuk stack trace).
- **PR perbaikan (dibuat agent, menyebut ID issue):** BELUM ADA. PR ini di-merge ke `latihan/sentry-bug`, bukan ke `main`. Perbaikannya menyentuh akar masalah, tidak sekadar membungkus dengan try/catch.
- **Issue resolved & tidak ada event baru setelah perbaikan ter-deploy** (perbaikan ter-deploy: BELUM ADA, tanggal & jam):

  ![Sentry issue resolved](docs/monitoring/2_sentry_issue_resolved.png)

## 2. Production health

- **Health check:** https://kopi-kita-eight.vercel.app/api/health
  - Membalas `{"status":"ok"}` (HTTP 200) kalau aplikasi dan database bisa dijangkau.
  - Membalas `{"status":"error"}` (HTTP 503) kalau database tidak merespons dalam 5 detik.
  - Respons tidak memuat nama host, versi, atau pesan error database. Alasan kegagalan hanya ditulis di log server.
- **Uptime monitor (UptimeRobot), aktif dan hijau:** BELUM ADA (interval: …)

  ![Uptime monitor up](docs/monitoring/3_uptime_monitor_up.png)

- **Email alert dari monitor yang sengaja dibuat gagal** (URL yang dipakai: BELUM ADA):

  ![Email alert monitor gagal](docs/monitoring/4_uptime_alert_email.png)

- **Vercel Speed Insights** (RES: BELUM ADA):

  ![Vercel Speed Insights](docs/monitoring/5_vercel_speed_insights.png)

## 3. Keamanan data & secret

- Tidak ada token Sentry atau connection string di repo. `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, dan `SENTRY_AUTH_TOKEN` hanya diisi di Vercel. `.env.example` berisi nama variabelnya saja.
- Data tamu tidak dikirim ke Sentry (`lib/sentry-options.ts`). Isi body request (nama, WhatsApp, catatan booking), cookie, query URL, nilai parameter query database, dan variabel lokal stack trace dimatikan.
- PostHog tetap menyamarkan input dan teks `.ph-mask` di session replay (lihat `tracking-plan.md`).

## 4. (Opsional) Analisis 1 query lambat

Belum dikerjakan. Kalau dikerjakan, wajib di **Neon dev branch**, bukan database production: teks query, alasan lambat (1–3 kalimat), perbaikan yang dicoba, dan waktu sebelum/sesudah.
