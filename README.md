# Kopi Kita

Kopi Kita adalah aplikasi web kedai kopi modern berbasis Next.js App Router, Tailwind CSS, dan TypeScript. Aplikasi ini dirancang dengan estetika warm artisan coffee yang menyajikan katalog produk interaktif, filter kategori, penanda stok ("Sold Out"), serta sistem reservasi meja lengkap dengan validasi komprehensif dan kartu konfirmasi instan.

## Fitur Utama

- **Halaman Beranda (`/`):**
  - Hero section menarik dengan call-to-action ke Menu dan Reservasi.
  - Statistik pengunjung, jam operasional, dan nilai keunggulan (*Artisan Roast*, *Single Origin*, *Warm Atmosphere*).
  - Menu rekomendasi terfavorit dengan harga dan rating.

- **Katalog Menu Interaktif (`/menu`):**
  - Sumber data terpusat di `lib/menu-data.ts`.
  - Filter kategori dinamis (*All*, *Coffee*, *Non-Coffee*, *Pastry*, *Food*).
  - Penanda badge **Sold Out** otomatis untuk produk dengan status `available: false`.
  - Modal detail produk interaktif dengan estimasi waktu penyajian, catatan rasa, dan deskripsi lengkap.

- **Reservasi Meja (`/booking`):**
  - Form reservasi meja dengan validasi ketat di sisi klien:
    - Menolak tanggal yang sudah lewat (hanya mengizinkan hari ini atau ke depan).
    - Menolak karakter huruf atau simbol pada nomor WhatsApp (hanya angka numerik, minimal 10 digit).
    - Pilihan slot waktu operasional (08:00 - 20:00) dan jumlah tamu (1 - 8 orang).
    - Pemilihan area duduk (*Indoor AC*, *Outdoor Garden*, *Smoking Area*, *Bar Counter*).
  - Kartu konfirmasi instan berbentuk tiket booking setelah submit data valid, dilengkapi tombol cetak dan reservasi baru.

- **Desain Responsif & Mikro-Interaksi:**
  - Navigasi navbar responsif dengan mobile drawer menu.
  - Palet warna konsisten (`espresso`, `mocha`, `caramel`, `cream`).
  - Halaman kustom 404 Not Found.

- **Backend & Database Engine (Module 3):**
  - **Dockerized PostgreSQL:** Menjalankan PostgreSQL dengan persistent volume `kopikita_pgdata` di port host 5433. Data tetap aman dan utuh saat container di-down lalu di-up.
  - **REST API Express (Port 4000):**
    - `GET /api/products`: Endpoint publik untuk katalog produk terhubung langsung ke PostgreSQL.
    - `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`: Manajemen produk terproteksi.
    - `POST /api/bookings`: Pembuatan reservasi publik.
    - `GET /api/bookings`: **Security Fence** terlindungi autentikasi JWT; mengembalikan HTTP 401 Unauthorized bila diakses tanpa token.
    - `PATCH /api/bookings/:id/status`: Perubahan status reservasi (pending, confirmed, completed, cancelled).
    - `POST /api/auth/login`: Autentikasi admin CMS.
  - **CMS Admin Dashboard (`/admin`):**
    - `/admin/login`: Halaman login admin dengan verifikasi token JWT.
    - `/admin/products`: Tabel manajemen produk realtime dengan filter kategori, toggle ketersediaan stok, modal tambah/edit produk, dan hapus produk.
    - `/admin/bookings`: Tabel manajemen reservasi meja dengan KPI summary card, filter status, dan dropdown ubah status realtime yang langsung tersimpan ke database.

- **Integrasi Penuh Frontend & Backend (Module 4):**
  - **Single Dev Server (Next.js App Router):** Seluruh REST API Express telah dimigrasikan ke Next.js Route Handlers (`app/api/...`), berjalan mulus dalam satu server terpadu di port 3000. Express port 4000 dipensiunkan sehingga tidak lagi memerlukan dual server orchestration maupun konfigurasi CORS lintas port.
  - **Direct PostgreSQL Integration:** Halaman `/menu` kini terhubung langsung ke PostgreSQL melalui route handler `GET /api/products` dengan loading skeleton state dan error state. Data mock tidak lagi digunakan.
  - **Two-way Sync CMS & Menu:** Perubahan nama, harga, atau ketersediaan produk di CMS `/admin/products` langsung tersinkronisasi dan tampil seketika di katalog pelanggan `/menu`.
  - **End-to-End Booking Journey:** Alur reservasi dari form `/booking` otomatis tersimpan ke PostgreSQL, menghasilkan tiket konfirmasi, muncul di antrean `/admin/bookings`, dan statusnya dapat langsung diperbarui ke "Dikonfirmasi".
  - **Server-Side Validation Defense (Sneaky Curl Protected):** Route handler `POST /api/bookings` menerapkan validasi ketat di sisi server (misal: menolak `party_size` di luar rentang 1–8 seperti `party_size: 999` dengan HTTP 400 Bad Request).
  - **Relative API Routing:** Semua pemanggilan API menggunakan path relatif (`/api/...`) pada origin yang sama.
  - **Security Fence Tetap Aktif:** Endpoint admin `GET /api/bookings` dan mutasi status diproteksi otentikasi JWT dengan status 401 Unauthorized jika token tidak disertakan.

## Tech Stack

- **Fullstack Web:** Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, TypeScript
- **Unified Route Handlers:** Next.js API Routes (`app/api/...`), JSON Web Token (JWT), bcryptjs
- **Database:** PostgreSQL 16 via Docker, node-postgres (`pg`) connection pooling (`lib/db.ts`)
- **Infrastructure:** Docker Compose dengan named volume `kopikita_pgdata` di port host 5433

## Struktur Proyek

```text
kopi-kita/
├── app/
│   ├── admin/
│   │   ├── bookings/
│   │   │   └── page.tsx       # CMS: Manajemen status reservasi meja
│   │   ├── login/
│   │   │   └── page.tsx       # CMS: Halaman login admin
│   │   ├── products/
│   │   │   └── page.tsx       # CMS: Tabel manajemen produk & CRUD
│   │   └── layout.tsx         # CMS: Shell layout & navigasi admin
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts # Route Handler: Login admin JWT
│   │   │   └── me/route.ts    # Route Handler: Verifikasi token sesi
│   │   ├── bookings/
│   │   │   ├── [id]/
│   │   │   │   ├── status/route.ts # Route Handler: PATCH status reservasi
│   │   │   │   └── route.ts        # Route Handler: Detail booking
│   │   │   └── route.ts       # Route Handler: GET (protected) & POST (strict validation)
│   │   └── products/
│   │       ├── [id]/route.ts  # Route Handler: PUT & DELETE produk
│   │       └── route.ts       # Route Handler: GET & POST katalog produk
│   ├── booking/
│   │   └── page.tsx           # Halaman reservasi meja (pelanggan)
│   ├── menu/
│   │   └── page.tsx           # Halaman katalog menu (DB-backed + loading/error states)
│   ├── globals.css            # Tailwind directives & tema warna
│   ├── layout.tsx             # Root layout dengan Navbar & Footer
│   ├── not-found.tsx          # Custom 404 page
│   └── page.tsx               # Halaman beranda / landing page
├── components/
│   ├── booking-form.tsx       # Form reservasi & kartu konfirmasi
│   ├── footer.tsx             # Footer informasi & tautan
│   ├── hero.tsx               # Hero section beranda
│   ├── highlights.tsx         # Fitur keunggulan & menu terpopuler
│   └── navbar.tsx             # Navbar sticky & menu mobile
├── lib/
│   ├── admin-auth.ts          # Helper otentikasi admin CMS (relative path /api)
│   ├── auth-server.ts         # Server-side JWT verification helper
│   ├── db.ts                  # PostgreSQL connection pool singleton
│   └── menu-data.ts           # Fallback initial catalog definitions
├── server/                    # Legacy Express engine (Module 3 refactored into Next.js)
│   ├── db/
│   │   ├── migrate.ts         # Skrip migrasi skema tabel
│   │   └── seed.ts            # Skrip seeder admin, produk, & booking
│   └── index.ts               # Express server legacy (port 4000)
├── docker-compose.yml         # Konfigurasi container PostgreSQL & persistent volume
├── .env.example               # Template environment variables (aman)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Menjalankan di Lokal

1. Pastikan Docker Desktop dan Node.js v20+ atau v22+ telah aktif.
2. Clone repository dan masuk ke folder proyek:
   ```bash
   git clone https://github.com/myepuell/kopi-kita.git
   cd kopi-kita
   ```
3. Salin konfigurasi environment:
   ```bash
   cp .env.example .env
   ```
4. Jalankan PostgreSQL container via Docker Compose:
   ```bash
   docker compose up -d
   ```
5. Install dependensi dan jalankan migrasi & seed database:
   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   ```
6. Jalankan Server Tunggal (Next.js App Router - port 3000):
   ```bash
   npm run dev
   ```
   *Catatan: Tidak perlu menjalankan server Express terpisah (port 4000). Seluruh API terintegrasi langsung dalam Next.js.*
7. Buka di browser:
   - Toko Pelanggan: [http://localhost:3000](http://localhost:3000)
   - Menu: [http://localhost:3000/menu](http://localhost:3000/menu)
   - Booking: [http://localhost:3000/booking](http://localhost:3000/booking)
   - CMS Admin: [http://localhost:3000/admin/products](http://localhost:3000/admin/products) (Login: `admin@kopikita.id` / `admin123`)

## Build Produksi

```bash
npm run build
npm run start
```

## Lisensi

Open source untuk keperluan belajar dan portofolio Universa Academy.
