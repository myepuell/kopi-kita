# Scope Statement: Pengujian Keamanan Kopi Kita

Pernyataan ini menetapkan aset yang **boleh** dan **tidak boleh** saya uji selama Module 3 (Security Mindset and Supply Chain) dan pekerjaan keamanan Kopi Kita berikutnya. Versi bertanda tangan: `security/scope-signed.jpg` (atau `.pdf`) di folder yang sama.

- **Pemilik & penguji:** pemilik repo `github.com/myepuell/kopi-kita` dan project Vercel `kopi-kita` (nama di kolom tanda tangan).
- **Berlaku:** sejak tanggal tanda tangan sampai dicabut atau diganti versi baru.

## Aset yang BOLEH diuji

| Aset | Cara yang diizinkan |
|---|---|
| Kode sumber repo `myepuell/kopi-kita` (semua branch dan riwayat Git) | Review kode manual, `gitleaks git`, `npm audit`, Dependabot |
| Dependensi npm di `package-lock.json` | `npm audit`, Dependabot alerts dan PR |
| Aplikasi yang berjalan di laptop sendiri (`http://localhost:*`) dengan Postgres lokal (Docker) berisi data contoh | Uji manual: token palsu, input tidak valid, error handling, konfigurasi env |
| Neon **dev branch** (bukan branch production) | Analisis query (`EXPLAIN ANALYZE`) dengan data contoh |

## Aset yang TIDAK BOLEH diuji secara aktif

| Aset | Batasan |
|---|---|
| Production `https://kopi-kita-eight.vercel.app` | Hanya pemakaian normal, monitoring pasif (uptime check ke `/api/health`), cek header pasif halaman publik (securityheaders.com atau `curl -I`), dan login admin milik sendiri. Tidak ada scanner, fuzzing, brute force login, load test, atau token palsu |
| Database Neon production | Tidak ada query uji. Hanya operasi pemilik (mis. mengganti password admin) |
| Vercel preview deployment | Hanya cek fungsi (bug latihan Sentry). Tidak di-scan, karena bisa memakai database yang sama dengan production |
| Layanan pihak ketiga: Vercel, Neon, GitHub, npm registry, PostHog, Sentry, UptimeRobot | Hanya mengatur akun sendiri. Platformnya tidak diuji |
| Aplikasi, repo, atau server milik teman sekelas maupun pihak lain | Tidak diuji sama sekali |
| Data pelanggan asli (nama, nomor WhatsApp, catatan reservasi) | Tidak diunduh, disalin, atau dimuat dalam laporan |

## Aturan

- Terlarang di aset mana pun: denial of service atau load test, social engineering/phishing, dan serangan ke platform pihak ketiga.
- Kalau menemukan secret aktif atau data asli: berhenti, catat lokasinya tanpa menyalin nilainya, lalu rotasi secret tersebut.
- Semua temuan dan hasil uji dicatat di folder `security/` repo ini.

## Tanda tangan

Saya memahami batasan di atas dan akan mematuhinya.

Nama: ______________________________

Tanda tangan: ______________________________

Tanggal: ______________________________
