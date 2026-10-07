import Link from "next/link";
import { Coffee, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md mx-auto py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-caramel/15 text-caramel mb-6">
          <Coffee className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-5xl font-black text-espresso">404</h1>
        <h2 className="mt-3 font-serif text-xl font-bold text-espresso">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mt-2 text-sm text-espresso/70">
          Maaf, cangkir kopi ini sepertinya kosong. Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-espresso px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-espresso/90 transition-all"
          >
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-espresso/20 bg-white px-5 py-2.5 text-sm font-semibold text-espresso hover:bg-cream transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Lihat Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
