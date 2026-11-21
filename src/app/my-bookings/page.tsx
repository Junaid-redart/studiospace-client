
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Hourglass } from "lucide-react";

import {
    CalendarDays,
    Clock3,
    MapPin,
    ArrowRight,
    RefreshCw,
    XCircle,
    CalendarX2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

interface Booking {
    _id: string;
    studioId: string;
    studioTitle: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    hourlyRate: number;
    studioRent: number;
    securityDeposit: number;
    totalAmount: number;
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
    createdAt: string;
}

const statusStyles: Record<Booking["status"], string> = {
    Pending: "bg-amber-100 text-amber-800",
    Confirmed: "bg-green-100 text-green-800",
    Completed: "bg-blue-100 text-blue-800",
    Cancelled: "bg-red-100 text-red-700",
};

function formatBookingDate(date: string) {
    const [year, month, day] = date.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatTime(time: string) {
    const [hours, minutes] = time.split(":").map(Number);

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;

    return `${formattedHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

export default function MyBookingsPage() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        if (isPending) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        const controller = new AbortController();

        const loadBookings = async () => {
            setIsLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my-bookings`,
                    {
                        credentials: "include",
                        signal: controller.signal,
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to load your bookings"
                    );
                }

                if (!Array.isArray(result.data)) {
                    throw new Error("Invalid booking data received");
                }

                setBookings(result.data);
            } catch (err) {
                if (controller.signal.aborted) return;

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong"
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        loadBookings();

        return () => controller.abort();
    }, [isPending, user?.id, router, reloadKey]);
    const handleCancelBooking = async () => {
        if (!cancelBookingId || isCancelling) return;

        setIsCancelling(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${cancelBookingId}/cancel`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to cancel booking.");
                return;
            }

            // Update booking status without reloading
            setBookings((previous) =>
                previous.map((booking) =>
                    booking._id === cancelBookingId
                        ? { ...booking, status: "Cancelled" }
                        : booking
                )
            );

            toast.success("Booking cancelled successfully!");
            setCancelBookingId(null);
        } catch (error) {
            console.error("Cancel Booking Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsCancelling(false);
        }
    };

    if (isPending || !user) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#F5F0E8]">
                <span className="loading loading-spinner loading-lg text-[#D4AD68]" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F0E8] px-5 py-12 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-6xl">

                {/* Page Header */}
                <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B58B49]">
                            Your Reservations
                        </p>

                        <h1 className="font-heading text-3xl font-bold text-[#22252A] sm:text-4xl">
                            My Bookings
                        </h1>

                        <p className="mt-3 text-sm text-gray-600">
                            Track and manage your creative workspace reservations.
                        </p>
                    </div>

                    <Link
                        href="/studios"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#D4AD68] px-5 py-3 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53]"
                    >
                        Explore Studios
                        <ArrowRight size={17} />
                    </Link>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid gap-5 md:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="space-y-5 rounded-2xl bg-[#FFFCF7] p-7"
                            >
                                <div className="skeleton h-7 w-3/4" />
                                <div className="skeleton h-5 w-1/3" />
                                <div className="skeleton h-4 w-2/3" />
                                <div className="skeleton h-12 w-full" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="rounded-2xl border border-red-200 bg-[#FFFCF7] px-6 py-16 text-center">
                        <h2 className="font-heading text-xl font-bold text-[#22252A]">
                            Unable to Load Bookings
                        </h2>

                        <p className="mt-3 text-sm text-red-600">{error}</p>

                        <button
                            type="button"
                            onClick={() => setReloadKey((previous) => previous + 1)}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AD68] px-6 py-3 text-sm font-bold text-[#22252A]"
                        >
                            <RefreshCw size={17} />
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && bookings.length === 0 && (
                    <div className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] px-6 py-20 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F0E8] text-[#B58B49]">
                            <CalendarX2 size={35} />
                        </div>

                        <h2 className="mt-6 font-heading text-2xl font-bold text-[#22252A]">
                            No Bookings Yet
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                            You have not booked any creative spaces yet.
                            Explore available studios and find your next workspace.
                        </p>

                        <Link
                            href="/studios"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#D4AD68] px-6 py-3 text-sm font-bold text-[#22252A]"
                        >
                            Explore Studios
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                )}

                {/* Booking Cards */}
                {!isLoading && !error && bookings.length > 0 && (
                    <>
                        <p className="mb-6 text-sm text-gray-600">
                            Showing {bookings.length}{" "}
                            {bookings.length === 1 ? "booking" : "bookings"}
                        </p>

                        <div className="grid items-start gap-6 md:grid-cols-2">
                            {bookings.map((booking) => (
                                <article
                                    key={booking._id}
                                    className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-6 shadow-sm sm:p-7"
                                >
                                    {/* Title and Status */}
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B58B49]">
                                                Studio Reservation
                                            </p>

                                            <h2 className="font-heading text-xl font-bold text-[#22252A]">
                                                {booking.studioTitle}
                                            </h2>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[booking.status] ||
                                                "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    {/* Date and Time */}
                                    <div className="mt-6 space-y-4 border-t border-[#E8E0D4] pt-6">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <CalendarDays
                                                size={18}
                                                className="shrink-0 text-[#B58B49]"
                                            />
                                            <span>{formatBookingDate(booking.bookingDate)}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Clock3
                                                size={18}
                                                className="shrink-0 text-[#B58B49]"
                                            />

                                            <span>
                                                {formatTime(booking.startTime)} –{" "}
                                                {formatTime(booking.endTime)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Hourglass
                                                size={18}
                                                className="shrink-0 text-[#B58B49]"
                                            />
                                            <span>
                                                Duration: {booking.totalHours} hours
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price Details */}
                                    <div className="mt-6 rounded-xl bg-[#F5F0E8] p-5">
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex justify-between gap-3">
                                                <span>Studio Rent</span>
                                                <span>
                                                    ৳{booking.studioRent.toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-3">
                                                <span>Security Deposit</span>
                                                <span>
                                                    ৳{booking.securityDeposit.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#DED6C9] pt-4">
                                            <span className="font-semibold text-[#22252A]">
                                                Total Amount
                                            </span>

                                            <span className="text-xl font-bold text-[#22252A]">
                                                ৳{booking.totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Booking Actions */}
                                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                                        <Link
                                            href={`/studios/${booking.studioId}`}
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#9B7135] transition hover:underline"
                                        >
                                            View Studio
                                            <ArrowRight size={16} />
                                        </Link>

                                        {booking.status === "Pending" && (
                                            <button
                                                type="button"
                                                onClick={() => setCancelBookingId(booking._id)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                            >
                                                <XCircle size={17} />
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {/* Cancel Booking Confirmation Modal */}
            {cancelBookingId && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
                    role="presentation"
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cancel-booking-title"
                        className="w-full max-w-md rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-7 shadow-2xl"
                    >
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <XCircle size={27} />
                        </div>

                        <h2
                            id="cancel-booking-title"
                            className="font-heading text-2xl font-bold text-[#22252A]"
                        >
                            Cancel Booking?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Are you sure you want to cancel this booking?
                            Your reservation status will be changed to Cancelled.
                        </p>

                        <div className="mt-7 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={isCancelling}
                                onClick={() => setCancelBookingId(null)}
                                className="rounded-lg border border-[#E8E0D4] px-5 py-2.5 text-sm font-semibold text-[#22252A] transition hover:bg-[#F5F0E8] disabled:opacity-50"
                            >
                                Keep Booking
                            </button>

                            <button
                                type="button"
                                disabled={isCancelling}
                                onClick={handleCancelBooking}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {isCancelling ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs" />
                                        Cancelling...
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={17} />
                                        Yes, Cancel
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
