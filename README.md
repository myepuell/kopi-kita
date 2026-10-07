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

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI & Styling:** React 19, Tailwind CSS, Lucide Icons
- **Language:** TypeScript
- **State & Data:** Centralized data store (`lib/menu-data.ts`)

## Struktur Proyek

```text
kopi-kita/
├── app/
│   ├── booking/
│   │   └── page.tsx       # Halaman reservasi meja
│   ├── menu/
│   │   └── page.tsx       # Halaman katalog menu & filter kategori
│   ├── globals.css        # Tailwind directives & tema warna
│   ├── layout.tsx         # Root layout dengan Navbar & Footer
│   ├── not-found.tsx      # Custom 404 page
│   └── page.tsx           # Halaman beranda / landing page
├── components/
│   ├── booking-form.tsx   # Form reservasi & kartu konfirmasi
│   ├── footer.tsx         # Footer informasi & tautan
│   ├── hero.tsx           # Hero section beranda
│   ├── highlights.tsx     # Fitur keunggulan & menu terpopuler
│   └── navbar.tsx         # Navbar sticky & menu mobile
├── lib/
│   └── menu-data.ts       # Data sumber menu, kategori, status stok
├── public/                # Aset statis & favicon
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Menjalankan di Lokal

1. Pastikan Node.js v20+ atau v22+ telah terpasang.
2. Clone repository dan masuk ke folder proyek:
   ```bash
   git clone https://github.com/myepuell/kopi-kita.git
   cd kopi-kita
   ```
3. Install dependensi:
   ```bash
   npm install
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Build Produksi

```bash
npm run build
npm run start
```

## Lisensi

Open source untuk keperluan belajar dan portofolio Universa Academy.
