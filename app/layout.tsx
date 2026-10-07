import type { Metadata, Viewport } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-cream text-espresso antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
