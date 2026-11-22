
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Building2,
  CalendarDays,
  Clock3,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

interface Booking {
  _id: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

interface Studio {
  _id: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [studios, setStudios] = useState<Studio[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const controller = new AbortController();

    const loadDashboard = async () => {
      setIsLoading(true);
      setError("");

      try {


        const [studiosResponse, bookingsResponse] =
          await Promise.all([
            fetch("/api/studios/my-listings", {
              credentials: "include",
              signal: controller.signal,
            }),
            fetch("/api/bookings/my-bookings", {
              credentials: "include",
              signal: controller.signal,
            }),
          ]);

        if (!studiosResponse.ok || !bookingsResponse.ok) {
          throw new Error("Failed to load dashboard information.");
        }

        const studiosResult = await studiosResponse.json();
        const bookingsResult = await bookingsResponse.json();

        if (
          !Array.isArray(studiosResult.data) ||
          !Array.isArray(bookingsResult.data)
        ) {
          throw new Error("Invalid dashboard data received.");
        }

        setStudios(studiosResult.data);
        setBookings(bookingsResult.data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => controller.abort();
  }, [isPending, user?.id, router, retryKey]);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const stats = [
    {
      title: "My Studios",
      value: studios.length,
      icon: Building2,
      href: "/my-listings",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: CalendarDays,
      href: "/my-bookings",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: Clock3,
      href: "/my-bookings",
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings,
      icon: CheckCircle2,
      href: "/my-bookings",
    },
  ];

  if (isPending || !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F5F0E8]">
        <span className="loading loading-spinner loading-lg text-[#D4AD68]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B58B49]">
            StudioSpace Dashboard
          </p>

          <h1 className="font-heading text-3xl font-bold text-[#22252A] sm:text-4xl">
            Welcome back, {user.name}!
          </h1>

          <p className="mt-4 text-sm text-gray-600">
            Manage your creative studios and track your bookings.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="space-y-5 rounded-2xl bg-[#FFFCF7] p-7"
              >
                <div className="skeleton h-12 w-12" />
                <div className="skeleton h-5 w-2/3" />
                <div className="skeleton h-10 w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-[#FFFCF7] p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => setRetryKey((key) => key + 1)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D4AD68] px-6 py-3 font-semibold text-[#22252A]"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {!isLoading && !error && (
          <>
            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <Link
                    key={stat.title}
                    href={stat.href}
                    className="group rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AD68]/20 text-[#A77C3F]">
                        <Icon size={24} />
                      </div>

                      <ArrowRight
                        size={18}
                        className="text-gray-400 group-hover:text-[#B58B49]"
                      />
                    </div>

                    <p className="mt-6 text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-4xl font-bold text-[#22252A]">
                      {stat.value}
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            <section className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-[#22252A]">
                Quick Actions
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-3">

                <Link
                  href="/add-studio"
                  className="flex items-center gap-4 rounded-2xl bg-[#22252A] p-6 text-white transition hover:bg-[#33373D]"
                >
                  <PlusCircle size={30} className="text-[#D4AD68]" />

                  <div>
                    <h3 className="font-bold">Add New Studio</h3>
                    <p className="mt-1 text-xs text-gray-300">
                      List a creative workspace
                    </p>
                  </div>
                </Link>

                <Link
                  href="/my-listings"
                  className="flex items-center gap-4 rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-6 transition hover:border-[#D4AD68]"
                >
                  <Building2 size={30} className="text-[#A77C3F]" />

                  <div>
                    <h3 className="font-bold text-[#22252A]">
                      My Studio Listings
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Manage your studio spaces
                    </p>
                  </div>
                </Link>

                <Link
                  href="/my-bookings"
                  className="flex items-center gap-4 rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-6 transition hover:border-[#D4AD68]"
                >
                  <CalendarDays size={30} className="text-[#A77C3F]" />

                  <div>
                    <h3 className="font-bold text-[#22252A]">
                      My Bookings
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      View your reservation history
                    </p>
                  </div>
                </Link>

              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
