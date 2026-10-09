"use client";

import { useState, useId, type FormEvent } from "react";
import { Calendar, Clock, Users, Phone, User, CheckCircle2, AlertCircle, MessageSquare, ArrowRight, RefreshCw } from "lucide-react";

interface BookingData {
  fullName: string;
  whatsapp: string;
  date: string;
  time: string;
  partySize: number;
  notes: string;
}

const TIME_SLOTS = [
  "09:00 WIB",
  "10:00 WIB",
  "11:00 WIB",
  "12:00 WIB",
  "13:00 WIB",
  "14:00 WIB",
  "15:00 WIB",
  "16:00 WIB",
  "17:00 WIB",
  "18:00 WIB",
  "19:00 WIB",
  "20:00 WIB",
  "21:00 WIB",
];

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingData>({
    fullName: "",
    whatsapp: "",
    date: "",
    time: "",
    partySize: 2,
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<BookingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayString = getTodayString();

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookingData, string>> = {};

    // Validasi Nama Lengkap
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap wajib diisi.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Nama lengkap minimal 3 karakter.";
    }

    // Validasi WhatsApp: hanya angka & minimal 10 digit (menolak huruf)
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "Nomor WhatsApp wajib diisi.";
    } else if (!/^\d+$/.test(formData.whatsapp.trim())) {
      newErrors.whatsapp = "Nomor WhatsApp hanya boleh berisi angka (tidak boleh huruf/simbol).";
    } else if (formData.whatsapp.trim().length < 10) {
      newErrors.whatsapp = "Nomor WhatsApp minimal 10 digit.";
    }

    // Validasi Tanggal: tidak boleh tanggal lampau
    if (!formData.date) {
      newErrors.date = "Tanggal reservasi wajib dipilih.";
    } else if (formData.date < todayString) {
      newErrors.date = "Tanggal tidak boleh tanggal lampau. Pilih hari ini atau mendatang.";
    }

    // Validasi Waktu
    if (!formData.time) {
      newErrors.time = "Waktu kedatangan wajib dipilih.";
    }

    // Validasi Jumlah Tamu
    if (!formData.partySize || formData.partySize < 1 || formData.partySize > 8) {
      newErrors.partySize = "Jumlah tamu harus antara 1 sampai 8 orang.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      // Relative path on same origin as required by Module 4 integration
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          whatsapp: formData.whatsapp,
          booking_date: formData.date,
          booking_time: formData.time,
          party_size: formData.partySize,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirimkan reservasi.");
      }

      setSubmittedData({ ...formData });
    } catch (err: any) {
      console.error("Booking submission error:", err);
      setServerError(err.message || "Terjadi kendala saat mengirimkan reservasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setServerError(null);
    setFormData({
      fullName: "",
      whatsapp: "",
      date: "",
      time: "",
      partySize: 2,
      notes: "",
    });
    setErrors({});
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Confirmation Card when submitted */}
      {submittedData ? (
        <div id="confirmation-card" className="overflow-hidden rounded-3xl border border-espresso/15 bg-white p-8 shadow-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-caramel">
            Permintaan Reservasi Diterima
          </span>
          <h2 className="mt-1 font-serif text-3xl font-extrabold text-espresso">
            Sampai Jumpa, {submittedData.fullName}!
          </h2>
          <p className="mt-2 text-sm text-espresso/70 leading-relaxed">
            Meja Anda telah kami catat. Tim Kopi Kita akan mengirimkan konfirmasi via WhatsApp ke{" "}
            <strong className="text-espresso">{submittedData.whatsapp}</strong>.
          </p>

          {/* Ticket Style Summary */}
          <div className="mt-8 rounded-2xl border border-dashed border-espresso/20 bg-cream p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-espresso/60 mb-4">
              Ringkasan Meja Anda
            </h3>
            <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-espresso/60">Tanggal</dt>
                <dd className="mt-1 font-bold text-espresso">{submittedData.date}</dd>
              </div>
              <div>
                <dt className="text-xs text-espresso/60">Jam Tiba</dt>
                <dd className="mt-1 font-bold text-espresso">{submittedData.time}</dd>
              </div>
              <div>
                <dt className="text-xs text-espresso/60">Jumlah Tamu</dt>
                <dd className="mt-1 font-bold text-espresso">{submittedData.partySize} Orang</dd>
              </div>
            </dl>

            {submittedData.notes && (
              <div className="mt-4 border-t border-espresso/10 pt-4 text-xs text-espresso/75">
                <span className="font-semibold text-espresso">Catatan:</span> {submittedData.notes}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-espresso/20 bg-cream py-3 text-sm font-semibold text-espresso hover:bg-cream-dark transition"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Buat Reservasi Baru</span>
            </button>
          </div>
        </div>
      ) : (
        /* Reservation Form */
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-3xl border border-espresso/10 bg-white p-6 sm:p-10 shadow-lg"
        >
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-caramel">
              Formulir Pemesanan
            </span>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-espresso">
              Reservasi Meja Anda
            </h2>
            <p className="mt-2 text-sm text-espresso/70">
              Isi data di bawah ini. Kami tidak mengenakan biaya reservasi maupun deposit.
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Gagal Menyimpan Reservasi</p>
                <p className="text-xs text-red-600 mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-espresso mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-espresso/40">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: "" });
                  }}
                  className={`w-full rounded-xl border bg-cream/40 py-2.5 pl-10 pr-4 text-sm text-espresso placeholder:text-espresso/40 focus:bg-white focus:outline-none focus:ring-2 ${
                    errors.fullName ? "border-red-500 focus:ring-red-200" : "border-espresso/15 focus:ring-caramel/30"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-semibold text-espresso mb-1.5">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-espresso/40">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="whatsapp"
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 081234567890"
                  value={formData.whatsapp}
                  onChange={(e) => {
                    setFormData({ ...formData, whatsapp: e.target.value });
                    if (errors.whatsapp) setErrors({ ...errors, whatsapp: "" });
                  }}
                  className={`w-full rounded-xl border bg-cream/40 py-2.5 pl-10 pr-4 text-sm text-espresso placeholder:text-espresso/40 focus:bg-white focus:outline-none focus:ring-2 ${
                    errors.whatsapp ? "border-red-500 focus:ring-red-200" : "border-espresso/15 focus:ring-caramel/30"
                  }`}
                />
              </div>
              {errors.whatsapp && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.whatsapp}
                </p>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-espresso mb-1.5">
                  Tanggal Reservasi
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-espresso/40">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    id="date"
                    type="date"
                    min={todayString}
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value });
                      if (errors.date) setErrors({ ...errors, date: "" });
                    }}
                    className={`w-full rounded-xl border bg-cream/40 py-2.5 pl-10 pr-4 text-sm text-espresso focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.date ? "border-red-500 focus:ring-red-200" : "border-espresso/15 focus:ring-caramel/30"
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-semibold text-espresso mb-1.5">
                  Jam Kedatangan
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-espresso/40">
                    <Clock className="h-4 w-4" />
                  </div>
                  <select
                    id="time"
                    value={formData.time}
                    onChange={(e) => {
                      setFormData({ ...formData, time: e.target.value });
                      if (errors.time) setErrors({ ...errors, time: "" });
                    }}
                    className={`w-full rounded-xl border bg-cream/40 py-2.5 pl-10 pr-4 text-sm text-espresso focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.time ? "border-red-500 focus:ring-red-200" : "border-espresso/15 focus:ring-caramel/30"
                    }`}
                  >
                    <option value="">Pilih Jam Kedatangan</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.time && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.time}
                  </p>
                )}
              </div>
            </div>

            {/* Party Size */}
            <div>
              <label className="block text-sm font-semibold text-espresso mb-2">
                Jumlah Tamu ({formData.partySize} Orang)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {PARTY_SIZES.map((size) => {
                  const isSelected = formData.partySize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData({ ...formData, partySize: size })}
                      className={`rounded-xl py-2.5 text-sm font-bold transition ${
                        isSelected
                          ? "bg-espresso text-cream shadow-sm"
                          : "border border-espresso/15 bg-cream/40 text-espresso hover:bg-cream-dark"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {errors.partySize && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.partySize}
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-espresso mb-1.5">
                Catatan Tambahan (Opsional)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute top-3 left-3.5 text-espresso/40">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Contoh: Meja dekat jendela, perayaan ulang tahun, butuh colokan listrik..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-espresso/15 bg-cream/40 py-2.5 pl-10 pr-4 text-sm text-espresso placeholder:text-espresso/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-caramel/30"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-caramel py-3.5 text-sm font-bold text-white shadow-md hover:bg-caramel-dark transition disabled:opacity-50"
            >
              <span>{isSubmitting ? "Memproses..." : "Konfirmasi Reservasi Meja"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
