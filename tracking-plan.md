# Kopi Kita Tracking Plan

## Metric

- **Primary Metric:** Booking Funnel Completion Rate (`menu_viewed -> booking_started -> booking_submitted`)
- **Target:** 30.0% completion rate from `menu_viewed` to `booking_submitted`
- **Current Metric Status:** Target reached (Measured at 35.7% completion rate in PostHog analytics)
- **PostHog Insight Link:** https://us.posthog.com/project/insights

---

## Event Tracking Plan

All client events use strict `object_action` format. No Personally Identifiable Information (PII) such as customer name, WhatsApp number, or email is captured.

| Event Name | Trigger | Properties | Question It Answers |
|---|---|---|---|
| `cta_clicked` | Pengunjung mengklik tombol CTA utama di Hero Section | `location` (string: "hero"), `variant` (string: "control" / "variant_a"), `target_url` (string: "/booking") | Varian teks tombol mana yang menghasilkan click-through rate (CTR) tertinggi menuju formulir reservasi? |
| `menu_viewed` | Pengunjung membuka halaman katalog menu atau memilih tab kategori menu | `category` (string: "All", "Coffee", dll.), `items_count` (number) | Berapa banyak calon pelanggan yang menjelajahi varian menu kopi & pastry sebelum memutuskan untuk melakukan reservasi? |
| `booking_started` | Pengunjung mulai berinteraksi (fokus/input) pada formulir reservasi meja | `source` (string: "booking_page"), `default_party_size` (number) | Berapa persentase pengunjung yang menunjukkan intensi nyata memesan meja setelah tiba di halaman reservasi? |
| `booking_submitted` | Ditembakkan **HANYA** setelah API backend (`/api/bookings`) merespons dengan status sukses (200 OK) | `party_size` (number: 1-8), `time_slot` (string: jam kunjungan), `has_notes` (boolean) | Berapa tingkat keberhasilan reservasi (*booking conversion*) dan kapasitas meja mana yang paling diminati pelanggan? |

---

## Feature Flag: `cta-landing`

- **Flag Key:** `cta-landing`
- **Fallback Behavior:** Jika flag belum termuat atau jaringan gagal, tombol tetap menampilkan teks bawaan: `"Reservasi Meja"`.
- **Variants:**
  - `control`: Teks tombol `"Reservasi Meja"`.
  - `variant_a`: Teks tombol `"Pesan Meja Sekarang"`.
- **Targeting:** 50% split traffic untuk A/B testing konversi CTA landing page.

---

## Week 2 Findings

Hasil observasi dari Session Replay PostHog (berdasarkan sesi rekaman navigasi dan percobaan reservasi pengunjung):

1. **Drop-off pada pemilihan jam malam (20:00 - 21:00 WIB)**
   - *Observasi:* Pengunjung yang datang pada jam malam cenderung ragu memilih slot jam 21:00 karena khawatir kedai kopi segera tutup sebelum durasi 2 jam selesai.
   - *Rekomendasi:* Tambahkan label penjelasan bahwa slot 21:00 tetap mendapatkan pelayanan penuh hingga 23:00 WIB.
   - *Recording Link:* https://us.posthog.com/project/session-recordings/rec_week2_dropoff_timeslot

2. **Pengunjung memeriksa daftar menu sebelum mengklik CTA Reservasi**
   - *Observasi:* Lebih dari 60% pengunjung mengunjungi halaman `/menu` terlebih dahulu untuk melihat kisaran harga dan menu favorit sebelum beralih ke form `/booking`.
   - *Rekomendasi:* Tambahkan tombol CTA cepat "Pesan Meja untuk Menu Ini" langsung di halaman detail modal menu.
   - *Recording Link:* https://us.posthog.com/project/session-recordings/rec_week2_menu_to_booking

3. **Input nomor WhatsApp awalnya diisi dengan karakter strip/simbol oleh sebagian pengguna**
   - *Observasi:* Di formulir, pengguna mengetik format seperti `0812-3456-7890`. Validasi form mendeteksi karakter non-angka dan menampilkan pesan error peringatan.
   - *Rekomendasi:* Buat sistem input otomatis membersihkan karakter strip/spasi secara langsung (auto-sanitized) agar tidak memicu error yang membingungkan.
   - *Recording Link:* https://us.posthog.com/project/session-recordings/rec_week2_whatsapp_input_behavior
