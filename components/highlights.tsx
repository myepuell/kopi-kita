import { Coffee, HeartHandshake, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Coffee,
    title: "Biji Kopi Terkurasi",
    desc: "Biji kopi single origin dipasok langsung dari petani lokal di Aceh Gayo, Toraja, dan Kintamani dengan profil sangrai konsisten.",
  },
  {
    icon: Sparkles,
    title: "Pastry Panggang Harian",
    desc: "Butter croissant klasik, sourdough renyah, dan kue lembut dipanggang setiap pagi tanpa pengawet tambahan.",
  },
  {
    icon: HeartHandshake,
    title: "Ruang Nyaman & Tenang",
    desc: "Koneksi internet stabil, colokan listrik di hampir setiap meja, dan area duduk ergonomis yang cocok untuk kerja santai.",
  },
];

const featuredList = [
  {
    name: "Kopi Susu Senopati",
    category: "Signature",
    price: "Rp 32.000",
    desc: "Espresso ganda, gula aren organik, susu segar dengan aroma harum.",
  },
  {
    name: "Manual Brew Gayo Natural",
    category: "Filter Coffee",
    price: "Rp 38.000",
    desc: "Notes ceri hitam, cokelat hitam, dan aftertaste manis yang bersih.",
  },
  {
    name: "Butter Croissant Klasik",
    category: "Pastry",
    price: "Rp 28.000",
    desc: "Lapisan flaky mentega Prancis dengan aroma wangi renyah.",
  },
  {
    name: "Iced Sea Salt Caramel Latte",
    category: "Specialty",
    price: "Rp 36.000",
    desc: "Kombinasi espresso lembut, saus karamel gurih, dan cold foam lembut.",
  },
];

export default function Highlights() {
  return (
    <div>
      {/* Features Grid */}
      <section className="py-16 sm:py-20 border-b border-espresso/10 bg-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-caramel">Kualitas Di Setiap Langkah</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-espresso sm:text-4xl">Mengapa Memilih Kopi Kita?</h2>
            <p className="mt-3 text-sm sm:text-base text-espresso/70">
              Setiap cangkir kopi diracik dengan presisi, menghargai perjalanan biji dari kebun hingga ke cangkir Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-2xl border border-espresso/10 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-caramel/15 text-caramel mb-4">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-serif text-lg font-bold text-espresso mb-2">{item.title}</h3>
                  <p className="text-sm text-espresso/70 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 sm:py-20 border-b border-espresso/10 bg-cream-dark/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-caramel">Menu Favorit</span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-espresso">Pilihan Terbaik Pelanggan</h2>
            </div>
            <Link
              href="/menu"
              className="mt-4 sm:mt-0 text-sm font-semibold text-caramel hover:text-caramel-dark underline underline-offset-4"
            >
              Lihat Semua Menu &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredList.map((item, i) => (
              <div key={i} className="flex flex-col justify-between rounded-2xl border border-espresso/10 bg-white p-5 shadow-sm">
                <div>
                  <div className="flex items-center justify-between text-xs text-caramel font-semibold mb-2">
                    <span>{item.category}</span>
                    <span className="text-espresso font-bold text-sm">{item.price}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-espresso">{item.name}</h3>
                  <p className="mt-2 text-xs text-espresso/70 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-espresso/5 flex items-center gap-1.5 text-xs text-green-700 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Tersedia Hari Ini
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section className="py-16 bg-espresso text-cream">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-block rounded-full bg-caramel/20 px-3.5 py-1 text-xs font-semibold text-caramel-light mb-4">
            Meja Terbatas
          </span>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl text-cream">Ingin Datang Bersama Teman atau Kolega?</h2>
          <p className="mt-4 text-sm sm:text-base text-cream/70 max-w-xl mx-auto">
            Reservasi meja lebih awal agar kami dapat menyiapkan sudut ternyaman untuk pertemuan atau waktu fokus Anda.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-caramel px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-caramel-light"
            >
              Pesan Meja Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
