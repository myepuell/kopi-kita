"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Menu as MenuIcon, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/booking", label: "Book a Table" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-espresso/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-serif text-xl font-bold tracking-tight text-espresso transition hover:text-caramel">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso text-cream shadow-sm">
            <Coffee className="h-5 w-5" />
          </span>
          <span className="text-xl tracking-tight">Kopi Kita</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  isActive
                    ? "font-semibold text-caramel dark:text-caramel"
                    : "text-espresso/80 hover:text-caramel"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/booking"
            className="rounded-full bg-caramel px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-caramel-dark focus:outline-none focus:ring-2 focus:ring-caramel/40"
          >
            Reservasi
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-espresso/10 text-espresso md:hidden hover:bg-espresso/5"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-espresso/10 bg-cream px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-base font-medium transition ${
                    isActive ? "bg-espresso/5 font-semibold text-caramel" : "text-espresso/80 hover:bg-espresso/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 block w-full rounded-full bg-caramel py-2.5 text-center text-sm font-semibold text-white shadow-sm"
            >
              Reservasi Meja
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
