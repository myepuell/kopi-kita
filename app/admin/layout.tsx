"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Coffee, CalendarCheck, LogOut, ExternalLink, ShieldCheck } from "lucide-react";
import { getAuthToken, getAuthUser, clearAuthSession, AdminUser } from "@/lib/admin-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = getAuthToken();
    const currentUser = getAuthUser();
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else {
      setUser(currentUser);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    clearAuthSession();
    router.push("/admin/login");
  };

  // If login page, render children directly without dashboard shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/products" className="flex items-center gap-2 group">
              <span className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                ☕
              </span>
              <div>
                <span className="font-serif font-bold text-lg text-amber-100">Kopi Kita</span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  CMS Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <Link
                href="/admin/products"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  pathname === "/admin/products"
                    ? "bg-stone-800 text-amber-400 font-semibold shadow-sm"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
                }`}
              >
                <Coffee className="w-4 h-4" />
                Daftar Produk
              </Link>
              <Link
                href="/admin/bookings"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  pathname === "/admin/bookings"
                    ? "bg-stone-800 text-amber-400 font-semibold shadow-sm"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                Reservasi Meja
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition-colors px-2.5 py-1.5 rounded-md hover:bg-stone-800/60"
            >
              <span>Lihat Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="h-4 w-px bg-stone-800 hidden sm:block" />

            <div className="flex items-center gap-2 text-xs">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="font-semibold text-stone-200 leading-tight">
                  {user?.name || "Manager Kopi Kita"}
                </div>
                <div className="text-[11px] text-stone-400 leading-tight">
                  {user?.email || "admin@kopikita.id"}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center gap-2 pt-3 mt-3 border-t border-stone-800/70">
          <Link
            href="/admin/products"
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium text-center flex items-center justify-center gap-1.5 ${
              pathname === "/admin/products"
                ? "bg-stone-800 text-amber-400 font-semibold"
                : "text-stone-400 hover:bg-stone-800/50"
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            Produk
          </Link>
          <Link
            href="/admin/bookings"
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium text-center flex items-center justify-center gap-1.5 ${
              pathname === "/admin/bookings"
                ? "bg-stone-800 text-amber-400 font-semibold"
                : "text-stone-400 hover:bg-stone-800/50"
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Reservasi
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 py-4 px-6 text-center text-xs text-stone-500">
        Kopi Kita CMS &copy; 2026 &bull; Docker PostgreSQL Persistence Engine &bull; Port 4000 Express API
      </footer>
    </div>
  );
}
