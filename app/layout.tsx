import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PostHogProvider } from "@/components/posthog-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kopi Kita — Ruang Nyaman untuk Secangkir Cerita",
  description: "Kedai kopi artisan dengan suasana hangat di Jakarta Selatan. Nikmati seduhan kopi pilihan, pastry segar, dan reservasi meja secara online.",
  keywords: ["kopi kita", "coffee shop", "jakarta selatan", "reservasi meja", "artisan coffee"],
  authors: [{ name: "Kopi Kita Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Membaca header membuat semua halaman dirender per request, sehingga Next.js bisa memasang
  // nonce CSP dari middleware.ts ke skripnya. Halaman statis tidak punya nonce dan akan diblokir CSP.
  await headers();

  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-cream text-espresso antialiased">
        <PostHogProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </PostHogProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
