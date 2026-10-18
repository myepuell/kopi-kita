# Temuan Keamanan W2M4: Kopi Kita

Per 18 Okt 2026. Status "Fixed" berlaku setelah PR terkait di-merge (urutan: #2 → #3 → #4 → PR tabel ini). Temuan Open menjadi bahan Module 5.

**Sumber:** review kode manual ([threat-model.md](threat-model.md)), Semgrep 1.180.0 (`p/default` + `p/owasp-top-ten`), cek header (`curl -I` / securityheaders.com), dan `npm audit` ([npm-audit.md](npm-audit.md)). Semua pengujian aktif hanya di localhost, sesuai [scope.md](scope.md).

## Tabel temuan

| ID | Temuan | OWASP 2025 | Lokasi | Sumber | Severity | Status |
|---|---|---|---|---|---|---|
| F01 | Kunci JWT cadangan tertulis di repo publik: token admin bisa dipalsukan kalau `JWT_SECRET` tidak di-set | A04 Cryptographic Failures | `lib/auth-server.ts`, `app/api/auth/login/route.ts`, `server/` | Review manual | Critical | **Fixed** (#2), `JWT_SECRET` production dirotasi pemilik |
| F02 | Password admin bawaan `admin123`: di seed, README, form login yang terisi otomatis, dan kotak "Kredensial Default" | A07 Authentication Failures | `server/db/seed.ts`, `README.md`, `app/admin/login/page.tsx` | Review manual | High | **Fixed** (#2) di kode. Password production diganti pemilik |
| F03 | Tanpa header keamanan (CSP, X-Frame-Options, dll.) dan cookie sesi admin tidak HttpOnly/Secure (token di `localStorage`) | A02 Security Misconfiguration | `next.config.ts`, `middleware.ts`, `lib/admin-auth.ts`, route login | `curl -I`, securityheaders.com, review | Medium | **Fixed** (#3) |
| F04 | Pesan error database terkirim ke pengunjung (`POST /api/bookings`) | A10 Mishandling of Exceptional Conditions | `app/api/bookings/route.ts` | Review manual | Low | **Fixed** (#2) |
| F05 | Login admin tanpa batas percobaan (brute force) | A07 Authentication Failures | `app/api/auth/login/route.ts` | Review manual | High | **Fixed** (#4) |
| F06 | TLS ke database tidak diverifikasi (`ssl: { rejectUnauthorized: false }`), rawan MITM | A04 Cryptographic Failures | `lib/db.ts:9` | Semgrep `bypass-tls-verification` | Medium | Open: perlu uji koneksi Neon dengan verifikasi sertifikat |
| F07 | `POST /api/bookings` tanpa rate limit/anti-spam | A06 Insecure Design | `app/api/bookings/route.ts` | Review manual | Medium | Open |
| F08 | Sesi JWT berlaku 7 hari dan tidak bisa dicabut per sesi. Logout hanya menghapus cookie | A07 Authentication Failures | `lib/admin-cookie.ts`, `lib/auth-server.ts` | Review manual | Medium | Open |
| F09 | `npm audit`: 5 high + 2 moderate di rantai Tailwind v3 (hanya saat build) | A03 Software Supply Chain Failures | `package-lock.json` | `npm audit` | Low | Open: ditunda sampai migrasi Tailwind v4 |
| F10 | Kode Express lama di `server/` (tidak di-deploy) tanpa rate limit dan flag cookie | A02 Security Misconfiguration | `server/` | Review manual | Low | Open: hapus atau arsipkan |
| F11 | Hanya satu akun admin, tanpa MFA | A07 Authentication Failures | `admin_users` | Review manual | Medium | Open |
| F12 | Rate limit login memakai IP dari `x-forwarded-for` | A07 Authentication Failures | `lib/login-rate-limit.ts` | Review manual | Low | Diterima: header ditimpa edge Vercel, hanya bisa dipalsukan kalau di-host sendiri tanpa proxy |
| F13 | CSP masih `style-src 'unsafe-inline'` | A02 Security Misconfiguration | `lib/csp.ts` | Review manual | Low | Diterima: atribut `style` dari React/motion tidak bisa diberi nonce. `script-src` tetap ber-nonce |
| F14 | Dependabot tanpa `cooldown`: versi paket yang baru beberapa jam rilis (bisa paket berbahaya) langsung diusulkan | A03 Software Supply Chain Failures | `.github/dependabot.yml` | Semgrep `dependabot-missing-cooldown` | Low | **Fixed** (#2), cooldown 7 hari |

## Bukti kontrol akses: semua endpoint admin tanpa cookie → 401

Build production PR #3 di localhost (`curl` tanpa cookie):

```
GET     /api/bookings                -> 401
PUT     /api/bookings/1              -> 401
DELETE  /api/bookings/1              -> 401
PATCH   /api/bookings/1/status       -> 401
POST    /api/products                -> 401
PUT     /api/products/1              -> 401
DELETE  /api/products/1              -> 401
GET     /api/auth/me                 -> 401
```

## Semgrep

`semgrep scan --config p/default --config p/owasp-top-ten --metrics=off` (Semgrep 1.180.0 via Docker):

| Kode | Temuan |
|---|---|
| `main` sebelum PR #2–#4 | 1: `bypass-tls-verification` @ `lib/db.ts:9` (F06) |
| Setelah PR #2–#4 | 1: `bypass-tls-verification` @ `lib/db.ts:9` (F06, Open). `dependabot-missing-cooldown` (F14) sempat muncul setelah `dependabot.yml` ditambahkan dan sudah diperbaiki di #2 |

Temuan F01–F05 tidak terdeteksi Semgrep (kunci cadangan dan password bawaan berupa string biasa, rate limit dan header bukan pola kode). Karena itu bukti sebelum/sesudahnya memakai `curl` di deskripsi PR #3 dan #4.

## securityheaders.com (`kopi-kita-eight.vercel.app`)

| | Nilai |
|---|---|
| Sebelum hardening | _(isi dari screenshot sebelum merge #3)_ |
| Sesudah hardening | _(isi dari screenshot sesudah merge #3)_ |

ZAP (opsional) tidak dikerjakan.
