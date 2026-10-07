import Link from "next/link";
import { Coffee, ArrowRight, Sparkles, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-espresso/10 bg-gradient-to-b from-cream via-cream to-cream-dark/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-caramel/30 bg-caramel/10 px-3.5 py-1 text-xs font-semibold text-caramel-dark">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Artisan Coffee & Warm Space</span>
            </div>

            <h1 className="font-serif text-4xl font-extrabold tracking-tight text-espresso sm:text-5xl lg:text-6xl">
              Secangkir Ketenangan di Sudut Jakarta.
            </h1>

            <p className="max-w-xl text-base text-espresso/80 leading-relaxed sm:text-lg">
              Biji kopi Nusantara sangrai artisan, pastry mentega segar yang dipanggang tiap pagi, dan ruang nyaman untuk bercerita tanpa terburu-buru.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3.5 text-sm font-semibold text-cream shadow-md transition hover:bg-espresso-light"
              >
                <span>Reservasi Meja</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full border border-espresso/20 bg-white/60 px-6 py-3.5 text-sm font-semibold text-espresso transition hover:bg-white hover:border-espresso/40"
              >
                <span>Lihat Menu</span>
              </Link>
            </div>

            {/* Quick stats / notes */}
            <div className="grid grid-cols-3 gap-4 border-t border-espresso/10 pt-6">
              <div>
                <p className="font-serif text-2xl font-bold text-espresso">100%</p>
                <p className="text-xs text-espresso/60">Arabica Lokal</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-espresso">Daily</p>
                <p className="text-xs text-espresso/60">Freshly Baked</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-espresso">08.00</p>
                <p className="text-xs text-espresso/60">Buka Setiap Hari</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl border border-espresso/10 bg-white p-6 shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mocha/10 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-espresso via-espresso/60 to-transparent">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-caramel/90 px-3 py-1 text-xs font-semibold">
                  <Coffee className="h-3.5 w-3.5" /> Signature Blend
                </span>
                <h3 className="mt-2 font-serif text-2xl font-bold">Kopi Susu Senopati</h3>
                <p className="text-xs text-cream/90 mt-1">Single origin espresso, gula aren organik, susu creamy & hint pandan lembut.</p>
                <p className="mt-3 text-lg font-bold text-caramel-light">Rp 32.000</p>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-cream p-3 text-xs text-espresso/80">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-caramel shrink-0" />
                  <span>Jl. Senopati No. 45, Jaksel</span>
                </div>
                <span className="font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Buka Sekarang</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
