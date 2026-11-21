"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BookingModal from "@/components/booking/BookingModal";
import StudioGalleryCarousel from "@/components/common/StudioGalleryCarousel";

import {
    ArrowLeft,
    MapPin,
    Users,
    ShieldCheck,
    Clock3,
    CheckCircle2,
    CalendarDays,
    UserRound,
    RefreshCw
} from "lucide-react";

interface Studio {
    _id: string;
    title: string;
    category: string;
    hourlyRate: number;
    securityDeposit: number;
    maxCapacity: number;
    location: string;
    imageUrl: string;
    images?: string[];
    amenities: string[];
    overview: string;
    ownerName: string;
    ownerEmail: string;
}

export default function StudioDetailsPage() {
    const params = useParams<{ id: string }>();
    const studioId = params.id;

    const [studio, setStudio] = useState<Studio | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const fetchStudio = async () => {
            setIsLoading(true);
            setError("");
            setStudio(null);

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/studios/${studioId}`,
                    { signal: controller.signal }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Failed to load studio");
                }

                if (!result.data) {
                    throw new Error("Studio data not found");
                }

                setStudio(result.data);
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

        fetchStudio();

        return () => controller.abort();
    }, [studioId, reloadKey]);

    if (isLoading) {
        return (
            <main className="min-h-[75vh] bg-[#F5F0E8] px-5 py-12">
                <div className="mx-auto max-w-6xl space-y-6">
                    <div className="skeleton h-8 w-44" />
                    <div className="skeleton h-12 w-2/3" />
                    <div className="skeleton h-96 w-full rounded-2xl" />

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="skeleton h-64 lg:col-span-2" />
                        <div className="skeleton h-64" />
                    </div>
                </div>
            </main>
        );
    }

    if (error || !studio) {
        return (
            <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F5F0E8] px-5 text-center">
                <h1 className="text-2xl font-bold text-[#22252A]">
                    Unable to Load Studio
                </h1>

                <p className="mt-3 text-sm text-gray-600">
                    {error || "Studio not found"}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => setReloadKey((previous) => previous + 1)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#D4AD68] px-5 py-3 text-sm font-semibold text-[#22252A]"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>

                    <Link
                        href="/studios"
                        className="rounded-lg border border-[#D4AD68] px-5 py-3 text-sm font-semibold text-[#22252A]"
                    >
                        Explore Studios
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F0E8] px-5 py-10 lg:px-8 lg:py-14">
            <div className="mx-auto max-w-6xl">

                {/* Back Link */}
                <Link
                    href="/studios"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#B58B49]"
                >
                    <ArrowLeft size={17} />
                    Back to Explore Studios
                </Link>

                {/* Heading */}
                <div className="mb-8">
                    <span className="inline-flex rounded-full bg-[#D4AD68]/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#9B7135]">
                        {studio.category}
                    </span>

                    <h1 className="mt-4 font-heading text-3xl font-bold text-[#22252A] sm:text-4xl">
                        {studio.title}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-2">
                            <MapPin size={17} className="text-[#B58B49]" />
                            {studio.location}
                        </span>

                        <span className="inline-flex items-center gap-2">
                            <Users size={17} className="text-[#B58B49]" />
                            Up to {studio.maxCapacity} people
                        </span>
                    </div>
                </div>


                {/* Studio Image Gallery */}
                <div className="mb-9">
                    <StudioGalleryCarousel
                        images={studio.images}
                        imageUrl={studio.imageUrl}
                        title={studio.title}
                    />
                </div>


                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">

                    {/* Left Content */}
                    <div className="space-y-7">

                        {/* Overview */}
                        <section className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-6 sm:p-8">
                            <SectionTitle title="About This Studio" />

                            <p className="mt-5 whitespace-pre-line text-sm leading-8 text-gray-600">
                                {studio.overview}
                            </p>
                        </section>

                        {/* Amenities */}
                        <section className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-6 sm:p-8">
                            <SectionTitle title="Studio Amenities" />

                            {studio.amenities.length > 0 ? (
                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    {studio.amenities.map((amenity, index) => (
                                        <div
                                            key={`${amenity}-${index}`}
                                            className="flex items-center gap-3 text-sm text-[#333]"
                                        >
                                            <CheckCircle2
                                                size={19}
                                                className="shrink-0 text-[#B58B49]"
                                            />
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-gray-500">
                                    No amenities listed.
                                </p>
                            )}
                        </section>

                        {/* Host Information */}
                        <section className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-6 sm:p-8">
                            <SectionTitle title="Meet Your Host" />

                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#D4AD68]/20 text-[#A77C3F]">
                                    <UserRound size={26} />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-[#22252A]">
                                        {studio.ownerName || "Studio Host"}
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        StudioSpace Host
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Reviews */}
                        <section className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-6 sm:p-8">
                            <SectionTitle title="Guest Reviews" />

                            <p className="mt-4 text-sm text-gray-500">
                                Reviews are not available yet.
                            </p>
                        </section>
                    </div>

                    {/* Right Pricing Card */}
                    <aside className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-6 shadow-sm lg:sticky lg:top-28">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#9B7135]">
                            Studio Rental
                        </p>

                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-[#22252A]">
                               ${studio.hourlyRate.toLocaleString()}
                            </span>

                            <span className="text-sm text-gray-500">/ hour</span>
                        </div>

                        <div className="mt-6 space-y-4 border-t border-[#E8E0D4] pt-6">
                            <InfoRow
                                icon={<ShieldCheck size={18} />}
                                label="Security Deposit"
                                value={`$${studio.securityDeposit.toLocaleString()}`}
                            />

                            <InfoRow
                                icon={<Users size={18} />}
                                label="Max Capacity"
                                value={`${studio.maxCapacity} people`}
                            />

                            <InfoRow
                                icon={<Clock3 size={18} />}
                                label="Pricing"
                                value="Hourly"
                            />
                        </div>

                        {/* Booking will be implemented next */}
                        <button
                            type="button"
                            onClick={() => setIsBookingModalOpen(true)}
                            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AD68] px-5 py-4 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53]"
                        >
                            <CalendarDays size={19} />
                            Book Workspace Now
                        </button>

                        <p className="mt-3 text-center text-xs text-gray-500">
                            Select your preferred date and time to request a booking.
                        </p>
                    </aside>
                </div>
            </div>
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                studio={{
                    _id: studio._id,
                    title: studio.title,
                    hourlyRate: studio.hourlyRate,
                    securityDeposit: studio.securityDeposit,
                }}
            />
        </main>
    );
}

function SectionTitle({ title }: { title: string }) {
    return (
        <h2 className="font-heading text-xl font-bold text-[#22252A]">
            {title}
        </h2>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
                <span className="text-[#B58B49]">{icon}</span>
                {label}
            </div>

            <span className="font-semibold text-[#22252A]">{value}</span>
        </div>
    );
}
