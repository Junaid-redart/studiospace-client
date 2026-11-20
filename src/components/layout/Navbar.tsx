"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Aperture,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  List,
  CalendarDays,
  LogOut,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
];

const userLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Add New Studio",
    href: "/add-studio",
    icon: PlusCircle,
  },
  {
    name: "My Studio Listings",
    href: "/my-listings",
    icon: List,
  },
  {
    name: "My Bookings",
    href: "/my-bookings",
    icon: CalendarDays,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed");
        return;
      }

      toast.success("Logged out successfully!");

      setIsMenuOpen(false);
      setIsProfileOpen(false);

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

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

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-4 lg:flex">

          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-white/10" />
          ) : user ? (

            /* Logged-in User Dropdown */
            <div className="relative">

              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3"
                aria-expanded={isProfileOpen}
                aria-label="Open profile menu"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AD68] font-bold text-[#22252A]">
                  {getInitial(user.name || "User")}
                </span>

                <span className="max-w-32 truncate text-sm font-medium">
                  {user.name}
                </span>

                <ChevronDown size={16} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-xl border border-[#E8E0D4] bg-[#FFFCF7] py-2 text-[#252525] shadow-xl">

                  <div className="border-b border-[#E8E0D4] px-4 py-3">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  {userLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-[#F5F0E8]"
                      >
                        <Icon size={17} />
                        {link.name}
                      </Link>
                    );
                  })}

                  <div className="border-t border-[#E8E0D4] pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      <LogOut size={17} />

                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>

                </div>
              )}
            </div>

          ) : (

            /* Logged-out Buttons */
            <>
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
            </>

          )}
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

          <div className="mt-6 border-t border-white/10 pt-5">

            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-lg bg-white/10" />
            ) : user ? (

              /* Mobile Logged-in Menu */
              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AD68] text-[#22252A]">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-3">
                  {userLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 text-sm hover:text-[#D4AD68]"
                      >
                        <Icon size={18} />
                        {link.name}
                      </Link>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 text-left text-sm text-red-400 disabled:opacity-60"
                  >
                    <LogOut size={18} />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>

              </div>

            ) : (

              /* Mobile Logged-out Buttons */
              <div className="flex items-center gap-4">

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

            )}
          </div>

        </div>
      )}
    </header>
  );
}