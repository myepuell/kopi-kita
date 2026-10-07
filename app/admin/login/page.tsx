"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Coffee } from "lucide-react";
import { API_BASE, setAuthSession } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kopikita.id");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login gagal, silakan periksa kredensial Anda.");
      }

      setAuthSession(data.token, data.user);
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Gagal terhubung ke backend API (Port 4000).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-600/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-400 mx-auto mb-4 text-2xl shadow-lg shadow-amber-950/40">
            ☕
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-100">CMS Admin Login</h1>
          <p className="text-sm text-stone-400 mt-1">
            Masuk untuk mengelola katalog menu dan reservasi Kopi Kita
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kopikita.id"
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none transition"
              />
            </div>
          </div>

          <div className="bg-stone-950/60 border border-stone-800/80 rounded-lg p-3 text-[11px] text-stone-400">
            <div className="font-semibold text-amber-400/90 mb-0.5">Kredensial Default Seed:</div>
            <div>Email: <code className="text-stone-300 font-mono">admin@kopikita.id</code></div>
            <div>Password: <code className="text-stone-300 font-mono">admin123</code></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 text-stone-950 font-bold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 hover:shadow-amber-900/40"
          >
            {loading ? (
              <span className="inline-block animate-spin mr-2">⏳</span>
            ) : (
              <>
                <span>Masuk ke CMS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-800/80 text-center">
          <Link
            href="/"
            className="text-xs text-stone-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Beranda Kopi Kita</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
