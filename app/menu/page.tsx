"use client";

import { useState, useEffect, useCallback } from "react";
import { CATEGORIES, formatRupiah, type MenuCategory, type MenuItem } from "@/lib/menu-data";
import { Coffee, Sparkles, X, CheckCircle2, AlertCircle, RefreshCw, Loader2 } from "lucide-react";

export default function MenuPage() {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>("All");
  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Relative path on the same origin as required by Module 4
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error(`Gagal memuat katalog menu (${res.status} ${res.statusText})`);
      }
      const data: MenuItem[] = await res.json();
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching menu:", err);
      setError(err.message || "Gagal menghubungi server menu Kopi Kita. Silakan periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const filteredItems = selectedCategory === "All"
    ? products
    : products.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-caramel">Menu Spesial Kami</span>
          <h1 className="mt-2 font-serif text-3xl font-extrabold text-espresso sm:text-4xl">
            Sajian Kopi & Pastry Harian
          </h1>
          <p className="mt-3 text-sm sm:text-base text-espresso/70">
            Dipersiapkan dengan bahan-bahan terbaik dari biji kopi Nusantara terpilih, disajikan segar setiap hari.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all shadow-sm ${
                  isActive
                    ? "bg-espresso text-cream shadow-md scale-105"
                    : "bg-white text-espresso/80 border border-espresso/10 hover:border-espresso/30 hover:bg-cream-dark"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12">
            <div className="flex flex-col items-center justify-center gap-3 mb-10">
              <Loader2 className="h-8 w-8 animate-spin text-caramel" />
              <p className="text-sm font-medium text-espresso/70">Memuat katalog menu dari database...</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="animate-pulse rounded-2xl border border-espresso/10 bg-white p-6 shadow-sm flex flex-col justify-between h-48"
                >
                  <div>
                    <div className="h-4 w-20 bg-espresso/10 rounded mb-3" />
                    <div className="h-6 w-3/4 bg-espresso/10 rounded mb-2" />
                    <div className="h-3 w-full bg-espresso/10 rounded mb-1" />
                    <div className="h-3 w-2/3 bg-espresso/10 rounded" />
                  </div>
                  <div className="h-6 w-24 bg-espresso/10 rounded mt-4" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mx-auto max-w-xl text-center py-16 px-4">
            <div className="rounded-3xl border border-red-200 bg-red-50/80 p-8 shadow-sm">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
              <h2 className="font-serif text-xl font-bold text-red-950 mb-2">Terjadi Kendala Memuat Menu</h2>
              <p className="text-sm text-red-800/80 mb-6">{error}</p>
              <button
                type="button"
                onClick={fetchMenu}
                className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-cream hover:bg-espresso-light transition shadow"
              >
                <RefreshCw className="h-4 w-4" /> Coba Muat Ulang
              </button>
            </div>
          </div>
        )}

        {/* Menu Grid */}
        {!loading && !error && (
          <>
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-espresso/10 p-8 max-w-md mx-auto">
                <Coffee className="h-10 w-10 text-espresso/40 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-espresso">Belum Ada Menu di Kategori Ini</h3>
                <p className="text-xs text-espresso/60 mt-1">Silakan pilih kategori lain atau periksa kembali nanti.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveModalItem(item)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-espresso/10 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-caramel/40 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-caramel">
                          {item.category}
                        </span>
                        
                        {/* Stock Badges */}
                        {!item.available ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                            <AlertCircle className="h-3 w-3" /> Sold Out
                          </span>
                        ) : item.isPopular ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-caramel/15 px-2.5 py-0.5 text-xs font-bold text-caramel-dark">
                            <Sparkles className="h-3 w-3" /> Favorit
                          </span>
                        ) : null}
                      </div>

                      <h3 className="font-serif text-lg font-bold text-espresso group-hover:text-caramel transition">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-sm text-espresso/70 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-espresso/5 pt-4">
                      <span className="text-base font-bold text-espresso">
                        {formatRupiah(item.price)}
                      </span>
                      <span className="text-xs font-semibold text-caramel group-hover:underline">
                        Lihat Detail &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Modal Item Detail */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg rounded-3xl border border-espresso/10 bg-white p-6 sm:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="absolute right-5 top-5 rounded-full p-2 text-espresso/60 hover:bg-espresso/5 hover:text-espresso"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-caramel/15 px-3 py-1 text-xs font-bold text-caramel-dark">
                  {activeModalItem.category}
                </span>
                {!activeModalItem.available && (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                    Sold Out
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl font-bold text-espresso mt-3">
                {activeModalItem.name}
              </h2>

              <p className="mt-3 text-base text-espresso/80 leading-relaxed">
                {activeModalItem.description}
              </p>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-cream p-4">
                <span className="text-sm text-espresso/70">Harga Satuan</span>
                <span className="font-serif text-xl font-bold text-espresso">
                  {formatRupiah(activeModalItem.price)}
                </span>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="w-full rounded-full bg-espresso py-3 text-sm font-semibold text-cream hover:bg-espresso-light transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
