"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, AlertCircle, RefreshCw, Star, Tag } from "lucide-react";
import { API_BASE, getAuthToken } from "@/lib/admin-auth";
import { formatRupiah } from "@/lib/menu-data";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  isPopular?: boolean;
  is_popular?: boolean;
  image?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Coffee");
  const [formPrice, setFormPrice] = useState<number | string>(30000);
  const [formDesc, setFormDesc] = useState("");
  const [formAvailable, setFormAvailable] = useState(true);
  const [formPopular, setFormPopular] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) throw new Error("Gagal memuat data produk dari API.");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormName("");
    setFormCategory("Coffee");
    setFormPrice(30000);
    setFormDesc("");
    setFormAvailable(true);
    setFormPopular(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setIsEditing(true);
    setEditingId(p.id);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormDesc(p.description || "");
    setFormAvailable(p.available);
    setFormPopular(Boolean(p.isPopular || p.is_popular));
    setIsModalOpen(true);
  };

  const handleToggleAvailable = async (p: Product) => {
    const token = getAuthToken();
    try {
      const nextAvailable = !p.available;
      const res = await fetch(`${API_BASE}/api/products/${p.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ available: nextAvailable }),
      });

      if (!res.ok) throw new Error("Gagal mengubah ketersediaan produk");
      
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, available: nextAvailable } : item))
      );
      showNotification(`Status ${p.name} diubah menjadi: ${nextAvailable ? "Tersedia" : "Habis (Sold Out)"}`);
    } catch (err: any) {
      alert(err.message || "Gagal mengupdate produk.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}" dari database?`)) return;
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal menghapus produk");

      setProducts((prev) => prev.filter((item) => item.id !== id));
      showNotification(`Produk "${name}" berhasil dihapus dari database.`);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus produk.");
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = getAuthToken();

    try {
      const payload = {
        name: formName,
        category: formCategory,
        price: Number(formPrice),
        description: formDesc,
        available: formAvailable,
        is_popular: formPopular,
        isPopular: formPopular,
      };

      if (isEditing && editingId) {
        const res = await fetch(`${API_BASE}/api/products/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal memperbarui produk di database");
        showNotification(`Produk "${formName}" berhasil diperbarui.`);
      } else {
        const res = await fetch(`${API_BASE}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal menambahkan produk ke database");
        showNotification(`Produk baru "${formName}" berhasil disimpan ke PostgreSQL.`);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan produk.");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ["All", "Coffee", "Non-Coffee", "Pastry", "Food"];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-100 flex items-center gap-3">
            <span>Katalog & Manajemen Produk</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {products.length} Menu Terdaftar
            </span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Kelola menu Kopi Kita yang tersimpan langsung di database PostgreSQL Docker.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors border border-stone-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5 shadow">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center gap-2.5 shadow">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? "bg-amber-600 text-stone-950 font-bold"
                  : "bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari produk / deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-100 placeholder-stone-500 outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-stone-950 border border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-900/90 border-b border-stone-800 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Nama Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Status Stok</th>
                <th className="py-3.5 px-4">Tag Favorit</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/70">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    Memuat data produk dari PostgreSQL...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    Tidak ada produk yang cocok dengan pencarian / kategori.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isPop = Boolean(p.isPopular || p.is_popular);
                  return (
                    <tr key={p.id} className="hover:bg-stone-900/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-100 text-sm">{p.name}</div>
                        <div className="text-[11px] text-stone-500 line-clamp-1 max-w-sm mt-0.5">
                          {p.description}
                        </div>
                        <div className="text-[10px] text-stone-600 font-mono mt-0.5">{p.id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-800 text-stone-300 border border-stone-700">
                          <Tag className="w-3 h-3 text-amber-500" />
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-stone-200">
                        {formatRupiah(p.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleAvailable(p)}
                          title="Klik untuk ubah ketersediaan"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            p.available
                              ? "bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/50"
                              : "bg-rose-950/70 text-rose-300 border border-rose-800/80 hover:bg-rose-900/50"
                          }`}
                        >
                          {p.available ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Tersedia</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-400" />
                              <span>Habis (Sold Out)</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        {isPop ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            Favorit
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-600">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Produk"
                            className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Hapus Produk"
                            className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative">
            <h2 className="text-xl font-serif font-bold text-stone-100 mb-4">
              {isEditing ? "Edit Data Produk" : "Tambah Produk Baru"}
            </h2>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nama Menu / Produk
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Espresso Romano"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-amber-500 outline-none"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Non-Coffee">Non-Coffee</option>
                    <option value="Pastry">Pastry</option>
                    <option value="Food">Food</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Harga (IDR)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Deskripsi Menu
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Ceritakan cita rasa, bahan racikan, atau keunikan menu..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:border-amber-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                  <input
                    type="checkbox"
                    checked={formAvailable}
                    onChange={(e) => setFormAvailable(e.target.checked)}
                    className="rounded bg-stone-950 border-stone-800 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Stok Tersedia (Aktif)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                  <input
                    type="checkbox"
                    checked={formPopular}
                    onChange={(e) => setFormPopular(e.target.checked)}
                    className="rounded bg-stone-950 border-stone-800 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Menu Favorit (Popular)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:bg-stone-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-stone-950 transition shadow"
                >
                  {submitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambahkan ke Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
