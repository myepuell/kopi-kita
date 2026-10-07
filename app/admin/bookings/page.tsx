"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  CheckCheck,
  RefreshCw,
  Phone,
  Users,
  MapPin,
  FileText,
  AlertCircle,
} from "lucide-react";
import { API_BASE, getAuthToken } from "@/lib/admin-auth";

interface Booking {
  id: number;
  full_name: string;
  whatsapp: string;
  booking_date: string;
  booking_time: string;
  party_size: number;
  seating_area: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | string;
  created_at?: string;
  updated_at?: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    if (!token) {
      setError("Token otentikasi tidak ditemukan. Silakan login terlebih dahulu.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Sesi login berakhir (401 Unauthorized). Silakan login ulang.");
        }
        throw new Error("Gagal memuat daftar reservasi dari database.");
      }

      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Gagal menghubungi backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Gagal memperbarui status reservasi di database");
      }

      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: updated.status } : b))
      );
      showNotification(`Status reservasi #${id} berhasil diubah menjadi "${newStatus.toUpperCase()}" dan disimpan ke PostgreSQL.`);
    } catch (err: any) {
      alert(err.message || "Gagal mengubah status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-800/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Dikonfirmasi
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/70 text-amber-300 border border-amber-800/80">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Menunggu
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-950/70 text-blue-300 border border-blue-800/80">
            <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
            Selesai
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/70 text-rose-300 border border-rose-800/80">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-stone-800 text-stone-300">
            {status}
          </span>
        );
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status.toLowerCase() === statusFilter;
    const matchesSearch =
      b.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.whatsapp.includes(searchTerm) ||
      (b.notes && b.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const countConfirmed = bookings.filter((b) => b.status === "confirmed").length;
  const countPending = bookings.filter((b) => b.status === "pending").length;
  const countCompleted = bookings.filter((b) => b.status === "completed").length;
  const countCancelled = bookings.filter((b) => b.status === "cancelled").length;

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-100 flex items-center gap-3">
            <span>Manajemen Reservasi Meja</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {bookings.length} Reservasi
            </span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Data reservasi dari pelanggan, tersimpan terpusat dan tersinkronisasi di PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            title="Refresh Data"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors border border-stone-700 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Segarkan Data</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl shadow">
          <div className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-amber-500" />
            Total Reservasi
          </div>
          <div className="text-2xl font-bold font-mono text-stone-100 mt-2">{bookings.length}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Semua catatan di DB</div>
        </div>

        <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl shadow">
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Dikonfirmasi
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-2">{countConfirmed}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Meja sudah disiapkan</div>
        </div>

        <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl shadow">
          <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Menunggu
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-2">{countPending}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Perlu konfirmasi staf</div>
        </div>

        <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl shadow">
          <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" />
            Dibatalkan / Selesai
          </div>
          <div className="text-2xl font-bold font-mono text-stone-200 mt-2">
            {countCancelled + countCompleted}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            {countCancelled} batal &bull; {countCompleted} selesai
          </div>
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
          {[
            { id: "all", label: "Semua Status" },
            { id: "pending", label: "Menunggu" },
            { id: "confirmed", label: "Dikonfirmasi" },
            { id: "completed", label: "Selesai" },
            { id: "cancelled", label: "Dibatalkan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? "bg-amber-600 text-stone-950 font-bold"
                  : "bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, WhatsApp, catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-100 placeholder-stone-500 outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Bookings Table Card */}
      <div className="bg-stone-950 border border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-900/90 border-b border-stone-800 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">ID & Pelanggan</th>
                <th className="py-3.5 px-4">Kontak WhatsApp</th>
                <th className="py-3.5 px-4">Jadwal & Sesi</th>
                <th className="py-3.5 px-4">Tamu & Area</th>
                <th className="py-3.5 px-4">Catatan Khusus</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ubah Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/70">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    Memuat data reservasi dari PostgreSQL...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    Tidak ada reservasi yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const formattedDate = b.booking_date
                    ? new Date(b.booking_date).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "-";

                  return (
                    <tr key={b.id} className="hover:bg-stone-900/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-stone-500 text-[10px]">#{b.id}</span>
                          <span className="font-semibold text-stone-100 text-sm">{b.full_name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <a
                          href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-stone-300 hover:text-emerald-400 transition-colors font-mono"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{b.whatsapp}</span>
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-200">{formattedDate}</div>
                        <div className="text-[11px] text-amber-400 font-mono mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {b.booking_time}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-stone-200 font-medium">
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          <span>{b.party_size} Orang</span>
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span>{b.seating_area}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        {b.notes ? (
                          <div className="text-[11px] text-stone-400 italic line-clamp-2 flex items-start gap-1">
                            <FileText className="w-3 h-3 text-stone-500 shrink-0 mt-0.5" />
                            <span>"{b.notes}"</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-600">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(b.status)}</td>

                      <td className="py-3.5 px-4 text-right">
                        <select
                          disabled={updatingId === b.id}
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className="bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-xl px-2.5 py-1.5 focus:border-amber-500 outline-none cursor-pointer disabled:opacity-50 transition"
                        >
                          <option value="pending">Menunggu (Pending)</option>
                          <option value="confirmed">Konfirmasi (Confirmed)</option>
                          <option value="completed">Selesai (Completed)</option>
                          <option value="cancelled">Batal (Cancelled)</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
