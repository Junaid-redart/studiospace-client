"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    Plus,
    MapPin,
    Users,
    Pencil,
    Trash2,
    Building2,
    ArrowRight,
    RefreshCw,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

interface Studio {
    _id: string;
    title: string;
    category: string;
    hourlyRate: number;
    securityDeposit: number;
    maxCapacity: number;
    location: string;
    imageUrl: string;
    amenities: string[];
    overview: string;
    ownerId: string;
    ownerName: string;
    ownerEmail: string;
    createdAt: string;
    updatedAt: string;
}

export default function MyListingsPage() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [studios, setStudios] = useState<Studio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [deleteStudioId, setDeleteStudioId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const user = session?.user;

    useEffect(() => {
        if (isPending) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        const controller = new AbortController();

        const fetchMyStudios = async () => {
            setIsLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/studios/my-listings`,
                    {
                        credentials: "include",
                        signal: controller.signal,
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        router.replace("/login");
                        return;
                    }

                    throw new Error(
                        result.message || "Failed to load your studios"
                    );
                }

                setStudios(result.data);
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

        fetchMyStudios();

        return () => controller.abort();
    }, [isPending, user?.id, router]);

    if (isPending || !user || isLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#F5F0E8]">
                <span className="loading loading-spinner loading-lg text-[#D4AD68]" />
            </div>
        );
    }
    const handleDeleteStudio = async () => {
        if (!deleteStudioId || isDeleting) return;

        setIsDeleting(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/studios/${deleteStudioId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to delete studio");
                return;
            }

            // Remove the deleted studio from the UI
            setStudios((previous) =>
                previous.filter((studio) => studio._id !== deleteStudioId)
            );

            toast.success("Studio deleted successfully!");
            setDeleteStudioId(null);
        } catch (error) {
            console.error("Delete Studio Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F5F0E8] px-4 py-12 sm:px-6 lg:py-16">
            <div className="mx-auto max-w-7xl">

                {/* Page Header */}
                <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B58B49]">
                            Host Dashboard
                        </p>

                        <h1 className="font-heading text-3xl font-bold text-[#22252A] sm:text-4xl">
                            My Studio Listings
                        </h1>

                        <p className="mt-3 text-sm text-gray-600">
                            Manage the creative spaces you&apos;ve shared.
                        </p>
                    </div>

                    <Link
                        href="/add-studio"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4AD68] px-5 py-3 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53]"
                    >
                        <Plus size={18} />
                        Add New Studio
                    </Link>
                </div>

                {/* Error State */}
                {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                        <p className="text-sm text-red-600">{error}</p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mx-auto mt-5 flex items-center gap-2 rounded-lg bg-[#22252A] px-5 py-2.5 text-sm text-white"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                    </div>
                ) : studios.length === 0 ? (

                    /* Empty State */
                    <div className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] px-6 py-20 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#D4AD68]/15 text-[#B58B49]">
                            <Building2 size={36} />
                        </div>

                        <h2 className="mt-6 font-heading text-2xl font-bold text-[#22252A]">
                            No Studios Listed Yet
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-600">
                            Start hosting by adding your first creative studio.
                            Your listings will appear here.
                        </p>

                        <Link
                            href="/add-studio"
                            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#D4AD68] px-6 py-3 text-sm font-bold text-[#22252A]"
                        >
                            List Your First Studio
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Studio Count */}
                        <p className="mb-6 text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-bold text-[#22252A]">
                                {studios.length}
                            </span>{" "}
                            {studios.length === 1 ? "studio" : "studios"}
                        </p>

                        {/* Studio Cards */}
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {studios.map((studio) => (
                                <article
                                    key={studio._id}
                                    className="overflow-hidden rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden bg-[#E8E0D4]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={studio.imageUrl}
                                            alt={studio.title}
                                            className="h-full w-full object-cover"
                                        />

                                        <span className="absolute left-4 top-4 rounded-full bg-[#22252A] px-3 py-1.5 text-xs font-medium text-white">
                                            {studio.category}
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5">
                                        <h2 className="font-heading text-xl font-bold text-[#22252A]">
                                            {studio.title}
                                        </h2>

                                        <div className="mt-4 space-y-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="shrink-0 text-[#B58B49]" />
                                                <span className="line-clamp-1">
                                                    {studio.location}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-[#B58B49]" />
                                                Up to {studio.maxCapacity} people
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between border-t border-[#E8E0D4] pt-4">
                                            <div>
                                                <span className="font-heading text-xl font-bold text-[#22252A]">
                                                    ৳{studio.hourlyRate.toLocaleString()}
                                                </span>

                                                <span className="ml-1 text-xs text-gray-500">
                                                    /hour
                                                </span>
                                            </div>

                                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                Listed
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-5 grid grid-cols-2 gap-3">
                                            <Link
                                                href={`/studios/edit/${studio._id}`}
                                                className="flex items-center justify-center gap-2 rounded-lg border border-[#D4AD68] px-4 py-2.5 text-sm font-semibold text-[#9B7135] transition hover:bg-[#D4AD68]/10"
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => setDeleteStudioId(studio._id)}
                                                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}

            </div>
            {deleteStudioId && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
                    role="presentation"
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                        className="w-full max-w-md rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-7 shadow-2xl"
                    >
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <Trash2 size={26} />
                        </div>

                        <h2
                            id="delete-modal-title"
                            className="font-heading text-2xl font-bold text-[#22252A]"
                        >
                            Delete Studio?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Are you sure you want to delete this studio?
                            This action cannot be undone.
                        </p>

                        <div className="mt-7 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setDeleteStudioId(null)}
                                className="rounded-lg border border-[#E8E0D4] px-5 py-2.5 text-sm font-semibold text-[#22252A] transition hover:bg-[#F5F0E8] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDeleteStudio}
                                className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Yes, Delete
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