import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kopi Kita — Ruang Nyaman untuk Secangkir Cerita",
  description: "Kedai kopi artisan dengan suasana hangat di Jakarta Selatan. Nikmati seduhan kopi pilihan dan pastry segar.",
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
