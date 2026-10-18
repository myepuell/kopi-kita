# Security Report: Kopi Kita

Per 18 Okt 2026 · production: https://kopi-kita-eight.vercel.app · repo: https://github.com/myepuell/kopi-kita

> Bagian bertanda **BELUM ADA** diisi setelah datanya benar-benar ada. Jangan diisi angka perkiraan.

## 1. Product & Data

**Produk.** Kopi Kita adalah situs kedai kopi (Next.js 15 di Vercel, Postgres di Neon). Pengunjung melihat menu (`/menu`) dan memesan meja (`/booking`). Pengelola mengatur menu dan status reservasi lewat CMS (`/admin`).

**Data yang dilindungi.** Nama, nomor WhatsApp, dan catatan tamu di tabel `bookings`, akun admin, serta menu dan harga.

| Indikator | Nilai |
|---|---|
| Metrik utama | Booking completion: `menu_viewed` → `booking_submitted` (funnel PostHog, lihat `tracking-plan.md`) |
| Target | **30%** |
| Angka PostHog saat ini | **BELUM ADA**: X% dari n orang, periode … |
| Link insight | **BELUM ADA** |
| Sentry | Kode terpasang (`instrumentation*.ts`, commit `556a878`). **Belum aktif di production**: `NEXT_PUBLIC_SENTRY_DSN` belum tertanam di build production per 18 Okt |
| Uptime | `/api/health` → `{"status":"ok"}` di production (18 Okt). Monitor UptimeRobot: **BELUM ADA** |

## 2. Scope

Batas uji ditandatangani di [security/scope.md](security/scope.md).
- **Boleh diuji:** kode repo dan riwayat Git, dependensi npm, aplikasi di localhost atau runner CI dengan database kontainer, serta Neon branch `ci`.
- **Tidak boleh diuji aktif:** production (hanya pemakaian normal, cek header pasif, dan uptime check), database Neon production, preview Vercel, platform pihak ketiga, dan aset orang lain.

## 3. Methodology

Yang dilakukan adalah **pemindaian otomatis dan review kode atas aplikasi sendiri, bukan penetration test.**

| Alat | Di mana | Apa yang dicari |
|---|---|---|
| `npm audit` | CI `supply-chain` | Dependensi rentan. Gagal bila ada critical |
| gitleaks 8.30.1 | CI `supply-chain` | Secret di seluruh riwayat Git |
| Semgrep 1.180.0 (`p/default`, `p/owasp-top-ten`) | CI `semgrep` | Pola kode tidak aman |
| ZAP baseline (pasif) | CI `zap-baseline`, target `http://localhost:3000` + Postgres service container | Header, cookie, kebocoran informasi |
| Lighthouse CI 0.15.1 | CI `quality`, Neon branch `ci` | Performance ≥ 0.7, accessibility ≥ 0.8 untuk `/`, `/menu`, `/booking` |
| Review kode manual + uji `curl`/Chrome headless | Localhost | Autentikasi, kontrol akses, CSP, rate limit |

**Autopilot:** [`.github/workflows/autopilot.yml`](.github/workflows/autopilot.yml) berjalan di setiap pull request, setiap hari pukul 06:00 WIB, dan manual (`workflow_dispatch`). Workflow memakai `permissions: contents: read`, tanpa secret di YAML, dan action dikunci ke commit SHA.

**Triase dengan agent AI:** hasil run dibaca agent (Claude Code), lalu diklasifikasikan menjadi perbaikan, risiko diterima, atau ditunda. Agent juga membuat PR perbaikan. Semua PR direview dan di-merge pemilik.

## 4. Findings

Detail per temuan: [security/temuan-w2m4.md](security/temuan-w2m4.md).

| ID | Temuan | OWASP Top 10:2025 | Sumber | Severity | Status |
|---|---|---|---|---|---|
| F01 | Kunci JWT cadangan tertulis di repo: token admin bisa dipalsukan | A04 Cryptographic Failures | Review | Critical | Fixed #2 |
| F02 | Password admin bawaan `admin123` (seed, README, form login terisi) | A07 Authentication Failures | Review | High | Fixed #2 (kode). Password production diganti pemilik |
| F03 | Tanpa header keamanan/CSP, cookie sesi tidak HttpOnly/Secure | A02 Security Misconfiguration | `curl -I`, review | Medium | Fixed #3 |
| F04 | Pesan error database terlihat pengunjung | A10 Mishandling of Exceptional Conditions | Review | Low | Fixed #2 |
| F05 | Login admin tanpa batas percobaan | A07 Authentication Failures | Review | High | Fixed #4 |
| F06 | TLS ke database tidak diverifikasi (`rejectUnauthorized: false`) | A04 Cryptographic Failures | Semgrep (autopilot) | Medium | Fixed #7 |
| F07 | `POST /api/bookings` tanpa rate limit | A06 Insecure Design | Review | Medium | Open |
| F08 | Sesi JWT 7 hari tidak bisa dicabut per sesi | A07 Authentication Failures | Review | Medium | Open |
| F09 | `npm audit` 5 high + 2 moderate (rantai Tailwind v3, khusus build) | A03 Software Supply Chain Failures | `npm audit` | Low | Ditunda (A-4) |
| F10 | Kode Express lama `server/` masih di repo (tidak di-deploy) | A02 Security Misconfiguration | Review | Low | Open |
| F11 | Satu akun admin tanpa MFA | A07 Authentication Failures | Review | Medium | Open |
| F12 | Rate limit memakai IP dari `x-forwarded-for` | A07 Authentication Failures | Review | Low | Diterima (A-3) |
| F13 | CSP `style-src 'unsafe-inline'` | A02 Security Misconfiguration | Review, ZAP 10055 | Low | Diterima (A-1) |
| F14 | Dependabot tanpa `cooldown` | A03 Software Supply Chain Failures | Semgrep | Low | Fixed #2 |
| F15 | Tanpa isolasi lintas-origin (COOP/COEP/CORP) | A02 Security Misconfiguration | ZAP 90004 (autopilot) | Low | Fixed #8 |

## 5. Proof of Fixes

| Temuan | PR | Bukti |
|---|---|---|
| F01, F02, F04, F14 | [#2](https://github.com/myepuell/kopi-kita/pull/2) | Localhost: token palsu dan `alg=none` → 401. Secret lama → login 503. Error DB → pesan umum. `gitleaks git`: no leaks found |
| F03 | [#3](https://github.com/myepuell/kopi-kita/pull/3) | Header sebelum/sesudah, cookie `HttpOnly; Secure; SameSite=strict`, 8 endpoint admin tanpa cookie → 401, 0 pelanggaran CSP di 6 halaman |
| F05 | [#4](https://github.com/myepuell/kopi-kita/pull/4) | Sebelum: 7× 401. Sesudah: 5× 401, lalu 429 + `Retry-After` (password benar pun 429) |
| F06 | [#7](https://github.com/myepuell/kopi-kita/pull/7) | Semgrep di [run PR #7](https://github.com/myepuell/kopi-kita/actions/runs/39097755572): **0 temuan** (sebelumnya 1) |
| F15 | [#8](https://github.com/myepuell/kopi-kita/pull/8) | ZAP di [run PR #8](https://github.com/myepuell/kopi-kita/actions/runs/39098251807): `PASS … [90004]`, WARN 0 |

## 6. Accepted Risks

| ID | Risiko | Alasan diterima | Di mana dikecualikan |
|---|---|---|---|
| A-1 | CSP `style-src 'unsafe-inline'` (F13, ZAP 10055) | Atribut `style` dari React/motion tidak bisa diberi nonce. `script-src` tetap ber-nonce + `strict-dynamic`, jadi injeksi skrip tetap diblokir | `.zap/rules.tsv` (IGNORE 10055) |
| A-2 | Halaman HTML tidak bisa di-cache (ZAP 10049 Non-Storable Content) | Sengaja: setiap respons halaman membawa nonce CSP baru, jadi tidak boleh disimpan cache. Ini informasi, bukan celah | `.zap/rules.tsv` (IGNORE 10049) |
| A-3 | Rate limit login per IP dari `x-forwarded-for` (F12) | Di Vercel header ini ditimpa edge Vercel. Hanya bisa dipalsukan kalau di-host sendiri tanpa proxy | Tidak ada pengecualian alat |
| A-4 | `npm audit` 5 high + 2 moderate di Tailwind v3 (F09) | Hanya dipakai saat build pada input milik sendiri, dan `braces` belum punya versi tambalan. Menunggu migrasi Tailwind v4 | `npm audit --audit-level=critical` (high tidak menggagalkan run) |

## 7. Before / After

| Pemeriksaan | Run pertama, sebelum perbaikan ([#39097340788](https://github.com/myepuell/kopi-kita/actions/runs/39097340788)) | Sesudah perbaikan |
|---|---|---|
| `npm audit` | 0 critical, 5 high, 2 moderate (lolos) | Sama (A-4). Sebelum Module 3: 1 critical |
| gitleaks | no leaks found (29 commit) | no leaks found |
| Semgrep | **1** temuan (F06) → gagal | **0** temuan ([run PR #7](https://github.com/myepuell/kopi-kita/actions/runs/39097755572)) |
| ZAP baseline | **3 WARN** (10049, 10055, 90004), PASS 64 → gagal | **0 WARN**, 2 IGNORE beralasan, PASS 65 ([run PR #8](https://github.com/myepuell/kopi-kita/actions/runs/39098251807)) |
| Lighthouse `/` | **BELUM ADA**: menunggu secret `CI_DATABASE_URL` (Neon branch `ci`) | **BELUM ADA** |
| Lighthouse `/menu` | **BELUM ADA** | **BELUM ADA** |
| Lighthouse `/booking` | **BELUM ADA** | **BELUM ADA** |
| Header production (`curl -I`) | Hanya HSTS | Diisi setelah #3 dan #8 ter-deploy (securityheaders.com) |

Run terbaru sesudah semua perbaikan di-merge: **BELUM ADA** (link run `workflow_dispatch` di `main`).
