import Link from "next/link";
import { Coffee, MapPin, Clock, Camera } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-espresso/10 bg-cream-dark text-espresso">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-espresso text-cream">
                <Coffee className="h-4 w-4" />
              </span>
              <span className="text-xl font-bold font-serif">Kopi Kita</span>
            </div>
            <p className="max-w-md text-sm text-espresso/70 leading-relaxed">
              Ruang hangat di sudut kota untuk seduhan kopi berkualitas, pastry segar panggang tiap hari, dan cerita yang mengalir santai.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-espresso/90">Lokasi & Jam</h4>
            <ul className="space-y-2 text-sm text-espresso/75">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-caramel shrink-0" />
                <span>Jl. Senopati No. 45, Jakarta Selatan</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-caramel shrink-0" />
                <span>Setiap Hari · 08.00 - 22.00 WIB</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-espresso/90">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-espresso/75">
              <li>
                <Link href="/menu" className="hover:text-caramel transition">Daftar Menu</Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-caramel transition">Reservasi Meja</Link>
              </li>
              <li className="flex items-center gap-2 pt-1 text-espresso/60">
                <Camera className="h-4 w-4" />
                <span>@kopikita.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-espresso/10 pt-6 text-center text-xs text-espresso/50">
          © {new Date().getFullYear()} Kopi Kita. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
