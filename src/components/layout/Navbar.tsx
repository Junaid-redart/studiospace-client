"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Aperture, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#22252A] text-white shadow-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[#D4AD68]"
        >
          <Aperture size={30} strokeWidth={1.8} />

          <span className="font-heading text-2xl font-bold">
            StudioSpace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#D4AD68] ${
                  isActive ? "text-[#D4AD68]" : "text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Authentication Buttons */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/login"
            className="text-sm font-medium transition-colors hover:text-[#D4AD68]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-[#D4AD68] px-5 py-2.5 text-sm font-semibold text-[#22252A] transition-colors hover:bg-[#C49A53]"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-lg p-2 text-[#D4AD68] lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#22252A] px-5 pb-6 lg:hidden">

          <div className="flex flex-col gap-4 pt-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium transition-colors hover:text-[#D4AD68]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-5">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg bg-[#D4AD68] px-5 py-2.5 text-sm font-semibold text-[#22252A]"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}