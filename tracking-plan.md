# Kopi Kita Tracking Plan

## Metric

- **Primary Metric:** Booking Funnel Completion Rate (`menu_viewed -> booking_started -> booking_submitted`)
- **Target:** 30.0% completion rate from `menu_viewed` to `booking_submitted`
- **Current Metric Status:** BELUM DIUKUR. Isi setelah funnel punya data dari minimal 5 orang: "Tercapai/Belum tercapai, X% (n = … orang, periode …)".
- **PostHog Insight Link:** BELUM ADA. Tempel link insight funnel yang sebenarnya (bentuknya `https://us.posthog.com/project/<id>/insights/<kode>`).

---

## Event Tracking Plan

All client events use strict `object_action` format. No Personally Identifiable Information (PII) such as customer name, WhatsApp number, or email is captured. Di session replay, semua input disamarkan (`maskAllInputs`), dan nama, nomor WA, serta catatan di kartu konfirmasi juga disamarkan (class `ph-mask`).

| Event Name | Trigger | Properties | Question It Answers |
|---|---|---|---|
| `cta_clicked` | Pengunjung mengklik tombol CTA utama di Hero Section | `location` (string: "hero"), `variant` (string: "control" / "variant_a"), `target_url` (string: "/booking") | Varian teks tombol mana yang menghasilkan click-through rate (CTR) tertinggi menuju formulir reservasi? |
| `menu_viewed` | Pengunjung membuka halaman katalog menu atau memilih tab kategori menu | `category` (string: "All", "Coffee", dll.), `items_count` (number) | Berapa banyak calon pelanggan yang menjelajahi varian menu kopi & pastry sebelum memutuskan untuk melakukan reservasi? |
| `booking_started` | Pengunjung pertama kali fokus ke salah satu isian formulir reservasi (sekali per kunjungan halaman) | `source` (string: "booking_page"), `default_party_size` (number) | Berapa persentase pengunjung yang menunjukkan intensi nyata memesan meja setelah tiba di halaman reservasi? |
| `booking_submitted` | Ditembakkan **HANYA** setelah API backend (`/api/bookings`) merespons sukses (`201 Created`, dicek lewat `res.ok`), bukan saat tombol diklik | `party_size` (number: 1-8), `time_slot` (string: jam kunjungan), `has_notes` (boolean) | Berapa tingkat keberhasilan reservasi (*booking conversion*) dan kapasitas meja mana yang paling diminati pelanggan? |

---

## Feature Flag: `cta-landing`

- **Flag Key:** `cta-landing`
- **Fallback Behavior:** Jika flag belum termuat atau jaringan gagal, tombol tetap menampilkan teks bawaan: `"Reservasi Meja"`.
- **Variants:**
  - `control`: Teks tombol `"Reservasi Meja"`.
  - `variant_a`: Teks tombol `"Pesan Meja Sekarang"`.
- **Targeting (diatur di PostHog):** 50% `control`, 50% `variant_a`. Key varian di PostHog harus persis `control` dan `variant_a`, karena kode hanya mengenali `variant_a`; nilai lain jatuh ke teks bawaan.

---

## Week 2 Findings

BELUM ADA DATA. Isi dari rekaman session replay yang benar-benar ada: sesi yang gagal booking atau sesi terpanjang. Tulis hanya yang terlihat di rekaman, dan salin link rekamannya dari PostHog (Replay → buka rekaman → Share/Copy link).

1. **(judul temuan)**
   - *Yang terlihat di rekaman:* …
   - *Dampak / dugaan penyebab:* …
   - *Rekomendasi:* …
   - *Recording Link:* …

2. **(judul temuan)**
   - *Yang terlihat di rekaman:* …
   - *Dampak / dugaan penyebab:* …
   - *Rekomendasi:* …
   - *Recording Link:* …

3. **(judul temuan)**
   - *Yang terlihat di rekaman:* …
   - *Dampak / dugaan penyebab:* …
   - *Rekomendasi:* …
   - *Recording Link:* …

### Hipotesis untuk dicek di rekaman (bukan temuan)

- Formulir dan server sama-sama menolak nomor WhatsApp yang berisi strip atau spasi (regex `^\d+$` di `components/booking-form.tsx` dan `app/api/bookings/route.ts`), padahal format seperti `0812-3456-7890` umum dipakai. Cek apakah ada rekaman pengunjung yang tertahan di pesan error ini.
