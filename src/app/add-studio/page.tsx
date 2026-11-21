"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Aperture,
    ArrowLeft,
    Building2,
    Camera,
    MapPin,
    DollarSign,
    Users,
    ShieldCheck,
    CheckCircle2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import ImageUploader from "@/components/common/ImageUploader";

const categories = [
    "Photography Studio",
    "Film & Video Studio",
    "Podcast Studio",
    "Music & Recording Studio",
    "Art & Creative Studio",
    "Event & Workshop Space",
];

const amenitiesList = [
    "Wi-Fi",
    "Air Conditioning",
    "Lighting Equipment",
    "Camera Equipment",
    "Sound System",
    "Changing Room",
    "Parking",
    "Makeup Station",
    "Backdrop",
    "Restroom",
];

export default function AddStudioPage() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const user = session?.user;

    // Protect private page
    useEffect(() => {
        if (!isPending && !user) {
            router.replace("/login");
        }
    }, [isPending, user, router]);

    const handleAmenityChange = (amenity: string) => {
        setSelectedAmenities((previous) =>
            previous.includes(amenity)
                ? previous.filter((item) => item !== amenity)
                : [...previous, amenity]
        );
    };
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (isSubmitting) return;

        const formData = new FormData(event.currentTarget);
        if (!imageUrl) {
            toast.error("Please upload a studio image before publishing.");
            return;
        }

        const studioData = {
            title: String(formData.get("title") || "").trim(),
            category: String(formData.get("category") || "").trim(),

            hourlyRate: Number(formData.get("hourlyRate")),
            securityDeposit: Number(formData.get("securityDeposit")),
            maxCapacity: Number(formData.get("capacity")),

            location: String(formData.get("location") || "").trim(),
            imageUrl: imageUrl,

            amenities: selectedAmenities,

            overview: String(formData.get("description") || "").trim(),
        };

        if (!process.env.NEXT_PUBLIC_API_URL) {
            toast.error("API URL is not configured");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/studios`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify(studioData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Your session has expired. Please login again.");
                    router.push("/login");
                    return;
                }

                toast.error(result.message || "Failed to create studio");
                return;
            }

            toast.success("Studio created successfully!");

           router.push("/my-listings");
            router.refresh();
        } catch (error) {
            console.error("Create studio error:", error);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    if (isPending || !user) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#F5F0E8]">
                <span className="loading loading-spinner loading-lg text-[#D4AD68]" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F0E8] px-4 py-10 sm:px-6 lg:py-16">
            <div className="mx-auto max-w-5xl">

                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-sm font-medium text-[#666] transition hover:text-[#22252A]"
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

                {/* Page Heading */}
                <div className="mb-10 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#D4AD68]/15 px-4 py-2 text-sm font-semibold text-[#9B7135]">
                        <Aperture size={17} />
                        Become a Studio Host
                    </div>

                    <h1 className="font-heading text-3xl font-bold text-[#22252A] sm:text-4xl">
                        List Your Creative Space
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                        Share your studio with creative professionals.
                        Fill out the details below to make your space available
                        for bookings.
                    </p>
                </div>

                {/* Form Container */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] shadow-sm"
                >

                    {/* Section 1: Basic Information */}
                    <section className="border-b border-[#E8E0D4] p-6 sm:p-8">
                        <SectionHeading
                            icon={<Building2 size={21} />}
                            title="Basic Information"
                            description="Tell us about your creative studio."
                        />

                        <div className="mt-7 grid gap-6 md:grid-cols-2">

                            <div className="md:col-span-2">
                                <FormLabel>Studio Title</FormLabel>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Urban Light Photography Studio"
                                    required
                                    className="studio-input"
                                />
                            </div>

                            <div>
                                <FormLabel>Studio Category</FormLabel>

                                <select
                                    name="category"
                                    required
                                    defaultValue=""
                                    className="studio-input"
                                >
                                    <option value="" disabled>
                                        Select a category
                                    </option>

                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <FormLabel>Maximum Capacity</FormLabel>

                                <input
                                    type="number"
                                    name="capacity"
                                    min="1"
                                    step="1"
                                    placeholder="e.g. 12"
                                    required
                                    className="studio-input"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Section 2: Pricing */}
                    <section className="border-b border-[#E8E0D4] p-6 sm:p-8">
                        <SectionHeading
                            icon={<DollarSign size={21} />}
                            title="Pricing Details"
                            description="Set your studio rental rates."
                        />

                        <div className="mt-7 grid gap-6 md:grid-cols-2">

                            <div>
                                <FormLabel>Hourly Rate (BDT)</FormLabel>

                                <input
                                    type="number"
                                    name="hourlyRate"
                                    min="1"
                                    step="0.01"
                                    placeholder="e.g. 1500"
                                    required
                                    className="studio-input"
                                />
                            </div>

                            <div>
                                <FormLabel>Security Deposit (BDT)</FormLabel>

                                <input
                                    type="number"
                                    name="securityDeposit"
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g. 2000"
                                    required
                                    className="studio-input"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Section 3: Location */}
                    <section className="border-b border-[#E8E0D4] p-6 sm:p-8">
                        <SectionHeading
                            icon={<MapPin size={21} />}
                            title="Studio Location"
                            description="Where can creators find your studio?"
                        />

                        <div className="mt-7">
                            <FormLabel>Full Address</FormLabel>

                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka"
                                required
                                className="studio-input"
                            />
                        </div>
                    </section>

                    {/* Section 4: Studio Image */}
                    <section className="border-b border-[#E8E0D4] p-6 sm:p-8">
                        <SectionHeading
                            icon={<Camera size={21} />}
                            title="Studio Image"
                            description="Add a high-quality image of your creative space."
                        />


                        <div className="mt-7">
                            <ImageUploader
                                value={imageUrl}
                                onChange={setImageUrl}
                            />

                            {!imageUrl && (
                                <p className="mt-3 text-xs text-gray-500">
                                    Please select and upload an image before publishing
                                    your studio.
                                </p>
                            )}
                        </div>

                    </section>

                    {/* Section 5: Amenities */}
                    <section className="border-b border-[#E8E0D4] p-6 sm:p-8">
                        <SectionHeading
                            icon={<CheckCircle2 size={21} />}
                            title="Studio Amenities"
                            description="Select the facilities available at your studio."
                        />

                        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">

                            {amenitiesList.map((amenity) => {
                                const selected = selectedAmenities.includes(amenity);

                                return (
                                    <label
                                        key={amenity}
                                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-3 text-sm transition ${selected
                                            ? "border-[#D4AD68] bg-[#D4AD68]/10 text-[#22252A]"
                                            : "border-[#E8E0D4] text-gray-600 hover:border-[#D4AD68]"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={() => handleAmenityChange(amenity)}
                                            className="checkbox checkbox-sm border-gray-400 checked:border-[#D4AD68] checked:bg-[#D4AD68]"
                                        />

                                        {amenity}
                                    </label>
                                );
                            })}

                        </div>
                    </section>

                    {/* Section 6: Description */}
                    <section className="border-b border-[#E8E0D4] p-6 sm:p-8">
                        <SectionHeading
                            icon={<Building2 size={21} />}
                            title="Studio Description"
                            description="Describe what makes your creative space special."
                        />

                        <div className="mt-7">
                            <FormLabel>Detailed Overview</FormLabel>

                            <textarea
                                name="description"
                                rows={6}
                                placeholder="Describe your studio, equipment, atmosphere, and ideal use cases..."
                                required
                                className="studio-input resize-y"
                            />
                        </div>
                    </section>

                    {/* Section 7: Owner Information */}
                    <section className="border-b border-[#E8E0D4] p-6 sm:p-8">
                        <SectionHeading
                            icon={<Users size={21} />}
                            title="Owner Information"
                            description="These details come from your logged-in account."
                        />

                        <div className="mt-7 grid gap-6 md:grid-cols-2">

                            <div>
                                <FormLabel>Owner Name</FormLabel>

                                <input
                                    type="text"
                                    value={user.name || ""}
                                    readOnly
                                    className="studio-input cursor-not-allowed bg-gray-100"
                                />
                            </div>

                            <div>
                                <FormLabel>Owner Email</FormLabel>

                                <input
                                    type="email"
                                    value={user.email || ""}
                                    readOnly
                                    className="studio-input cursor-not-allowed bg-gray-100"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Submit Section */}
                    <div className="p-6 sm:p-8">

                        <div className="mb-6 flex items-start gap-3 rounded-lg bg-[#F5F0E8] p-4">
                            <ShieldCheck
                                size={21}
                                className="mt-0.5 shrink-0 text-[#B58B49]"
                            />

                            <p className="text-sm leading-6 text-gray-600">
                                Please provide accurate information about your studio.
                                Your listing details will be visible to potential customers.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-[#D4AD68] px-6 py-4 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Publishing Studio..." : "Publish Studio"}
                        </button>

                    </div>

                </form>
            </div>

            <style jsx global>{`

        .studio-input 
        {
          width: 100%;
          margin-top: 0.5rem;
          border: 1px solid #ded6c9;
          border-radius: 0.5rem;
          background: #fffcf7;
          padding: 0.85rem 1rem;
          color: #22252a;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .studio-input:focus {
          border-color: #d4ad68;
        }

        .studio-input::placeholder {
          color: #a3a3a3;
        }

        .studio-input:read-only {
          background: #f3f4f6;
        }
      `}</style>
        </main>
    );
}

function FormLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="block text-sm font-semibold text-[#333]">
            {children}
        </label>
    );
}

function SectionHeading({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#D4AD68]/15 text-[#A77C3F]">
                {icon}
            </div>

            <div>
                <h2 className="font-heading text-lg font-bold text-[#22252A]">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

        </div>
    );
}