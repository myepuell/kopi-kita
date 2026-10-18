# npm audit: Kopi Kita

Dijalankan 18 Okt 2026 dengan `npm audit` (Node 22.23.2) di lockfile repo ini, 399 paket (172 prod, 142 dev, 112 optional). Hanya membaca `package-lock.json` dan database advisory npm. Tidak ada pemindaian ke situs production.

## Ringkasan

| Severity | Sebelum upgrade Next (lockfile `7d73f49`) | Setelah Next 15.5.28 (`556a878`) | Setelah PR ini |
|---|---|---|---|
| Critical | 1 | **0** | **0** |
| High | 7 | 6 | 5 |
| Moderate | 2 | 3 | 2 |
| **Total** | 10 | 9 | 7 |

## Sudah diperbaiki

| Paket | Severity | Advisory | Perbaikan |
|---|---|---|---|
| `next` 15.1.12 | critical | Puluhan advisory Next.js, termasuk RCE di Image Optimization ([GHSA-2464-fhr4-w9xw](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw)) | Upgrade ke 15.5.28, versi tambalan untuk seri 15 (commit `556a878`). `sharp` ikut naik ke 0.35.5 |
| `postcss` 8.4.31 (bawaan `next`) | high + moderate | [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q), [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) | `"overrides": { "postcss": "$postcss" }` di `package.json`, sehingga semua paket memakai PostCSS 8.5.30. CSS hasil build dibandingkan sebelum/sesudah: sha256-nya identik. Temuan moderate di `next` (turunan PostCSS) ikut hilang |

## Ditunda, beserta alasannya

| Paket | Severity | Advisory | Alasan ditunda | Rencana |
|---|---|---|---|---|
| `braces` 3.0.3 (lewat `chokidar`, `micromatch`, `fast-glob` ← `tailwindcss` 3.4.19) | high | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): DoS lewat pola bersarang yang sangat dalam | Belum ada versi `braces` yang ditambal (3.0.3 adalah versi terbaru). Paket ini hanya dipakai Tailwind saat build untuk membaca pola `content` milik kita sendiri, tidak menerima input pengunjung, dan tidak ikut ke runtime | Migrasi ke Tailwind CSS v4, perbaikan yang disarankan `npm audit` (semver major) |
| `postcss-selector-parser` 6.1.4 (lewat `tailwindcss`, `postcss-nested`) | moderate | [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf): CPU berlebih saat mem-parse selector | Versi tambalan (7.1.6) adalah major baru yang tidak didukung Tailwind v3. Inputnya CSS milik kita sendiri saat build | Ikut migrasi Tailwind v4 |
| `tailwindcss`, `chokidar`, `fast-glob`, `micromatch`, `postcss-nested` | high/moderate | Turunan dari dua baris di atas | Sama | Sama |

**Kenapa migrasi Tailwind v4 tidak dikerjakan di PR ini:** perubahannya besar. Konfigurasi pindah ke CSS, beberapa kelas utilitas berganti nama, dan tampilan semua halaman perlu dicek ulang. Migrasi akan dikerjakan di PR terpisah. Dependabot (`.github/dependabot.yml`) akan membuka PR versi barunya.

Tidak ada temuan critical yang tersisa.
