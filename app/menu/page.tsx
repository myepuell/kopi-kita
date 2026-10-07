"use client";

import { useState } from "react";
import { CATEGORIES, MENU_ITEMS, formatRupiah, type MenuCategory, type MenuItem } from "@/lib/menu-data";
import { Coffee, Sparkles, X, CheckCircle2, AlertCircle } from "lucide-react";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>("All");
  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);

  const filteredItems = selectedCategory === "All"
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === selectedCategory);

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
            Dipersiapkan dengan bahan-bahan terbaik, disajikan hangat dengan ketulusan barista kami.
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

        {/* Menu Grid */}
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
