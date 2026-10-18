# Threat Model: Kopi Kita

Per 18 Okt 2026 · kategori [OWASP Top 10:2025](https://top10.owasp.org/2025) · batas uji: [scope.md](scope.md)

## Assets

- **Data tamu** (nama, WhatsApp, catatan) dan **menu & harga** di Postgres Neon.
- **Akses admin**: akun `admin_users`, `JWT_SECRET`, token admin (7 hari).
- **Secret & akun deploy**: `DATABASE_URL`, `JWT_SECRET`, `SENTRY_AUTH_TOKEN` di Vercel, akun GitHub/Vercel (push ke `main` = deploy). Juga **ketersediaan** situs.

## Entry Points

- **Publik:** `/`, `/menu`, `/booking`, `GET /api/products`, `POST /api/bookings`, `GET /api/health`.
- **Admin:** `POST /api/auth/login`, `/admin/*`, API admin booking & produk (JWT Bearer/cookie).
- **Rantai pasok:** paket npm, GitHub → auto-deploy Vercel, skrip PostHog/Sentry.

## Threats & Mitigations

| # | Ancaman | OWASP 2025 | Mitigasi (status) |
|---|---|---|---|
| 1 | Token admin dipalsukan pakai kunci JWT cadangan di repo | A04 Cryptographic Failures | Kunci cadangan dihapus, `JWT_SECRET` ≥ 32 karakter wajib, HS256 (**PR ini**), secret production wajib dirotasi |
| 2 | Login admin dengan password bawaan atau tebakan berulang | A07 Authentication Failures | Seed DB cloud wajib `ADMIN_SEED_PASSWORD`, password production diganti (**sebagian**: rate limit belum) |
| 3 | Membaca/mengubah booking atau menu tanpa login | A01 Broken Access Control | Semua API admin cek JWT → 401, diuji di localhost termasuk token palsu & `alg=none` (**ada**) |
| 4 | SQL injection, atau XSS yang mencuri token admin | A05 Injection | Query berparameter, whitelist status, React meng-escape output, tanpa `dangerouslySetInnerHTML` (**ada**) |
| 5 | Paket npm rentan/berbahaya masuk build | A03 Software Supply Chain Failures | Lockfile, `npm audit` 0 critical, Dependabot, Next 15.5.28, override PostCSS (**PR ini**) |
| 6 | Pesan error database terlihat pengunjung | A10 Mishandling of Exceptional Conditions | Booking & health hanya membalas pesan umum, detail di log server (**PR ini**) |
| 7 | Data tamu ikut terkirim ke Sentry/PostHog | A02 Security Misconfiguration | Sentry `dataCollection` dibatasi, PostHog `maskAllInputs` + `.ph-mask` (**ada**) |
| 8 | Error atau situs mati tidak ketahuan | A09 Security Logging and Alerting Failures | Sentry + UptimeRobot ke `/api/health` dengan alert email (**kode siap**, akun menyusul) |
| 9 | Form booking dibanjiri spam | A06 Insecure Design | Validasi server: tanggal, tamu 1–8, WhatsApp (**sebagian**: rate limit belum) |

## Residual Risk

- Belum ada **rate limit** di login & booking (rencana: aturan Vercel Firewall).
- **Token admin di `localStorage`** (7 hari), hanya bisa dicabut dengan merotasi `JWT_SECRET`.
- Belum ada **header keamanan** (CSP, `X-Frame-Options`). Satu akun admin **tanpa MFA**.
- `npm audit` **5 high + 2 moderate** di rantai Tailwind v3, hanya saat build ([npm-audit.md](npm-audit.md)).
