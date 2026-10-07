import BookingForm from "@/components/booking-form";
import { Clock, ShieldCheck, Users } from "lucide-react";

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Info header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-caramel">
            Simpan Tempat Anda
          </span>
          <h1 className="mt-2 font-serif text-3xl font-extrabold text-espresso sm:text-4xl">
            Reservasi Meja di Kopi Kita
          </h1>
          <p className="mt-3 text-sm sm:text-base text-espresso/70">
            Dapatkan sudut ternyaman untuk berbincang, bekerja, atau menikmati kopi favorit Anda.
          </p>
        </div>

        {/* Benefits bar */}
        <div className="mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-xs text-espresso/80">
          <div className="flex items-center gap-2.5 rounded-xl border border-espresso/10 bg-white p-3 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-caramel shrink-0" />
            <span>Tanpa biaya deposit</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-espresso/10 bg-white p-3 shadow-sm">
            <Users className="h-4 w-4 text-caramel shrink-0" />
            <span>Kapasitas 1 - 8 orang</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-espresso/10 bg-white p-3 shadow-sm">
            <Clock className="h-4 w-4 text-caramel shrink-0" />
            <span>Durasi nyaman 2 jam</span>
          </div>
        </div>

        {/* Booking Form component */}
        <BookingForm />
      </div>
    </div>
  );
}
