"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import {
  ArrowLeft,
  Building2,
  Save,
  MapPin,
  DollarSign,
  Camera,
  Users,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import ImageUploader from "@/components/common/ImageUploader";

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
}

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

export default function EditStudioPage() {
  const router = useRouter();

  const params = useParams<{ id: string }>();
  const studioId = params.id;

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load existing studio
  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const controller = new AbortController();

    const fetchStudio = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/studios/${studioId}`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load studio");
        }

        const studioData: Studio = result.data;

        // Frontend ownership check
        if (studioData.ownerId !== user.id) {
          setError("You are not authorized to edit this studio.");
          return;
        }

        setStudio(studioData);
        setSelectedAmenities(studioData.amenities);
        setImageUrl(studioData.imageUrl || "");
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
  }, [studioId, isPending, user?.id, router]);

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity]
    );
  };

  // Update Studio
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!studio || !user || studio.ownerId !== user.id || isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    if (!imageUrl) {
      toast.error("Please upload a studio image before saving.");
      return;
    }

    const updatedStudio = {
      title: String(formData.get("title") || "").trim(),
      category: String(formData.get("category") || "").trim(),

      hourlyRate: Number(formData.get("hourlyRate")),
      securityDeposit: Number(formData.get("securityDeposit")),
      maxCapacity: Number(formData.get("maxCapacity")),

      location: String(formData.get("location") || "").trim(),
      imageUrl: imageUrl,

      amenities: selectedAmenities,

      overview: String(formData.get("overview") || "").trim(),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/studios/${studioId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(updatedStudio),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Please login again.");
          router.push("/login");
          return;
        }

        toast.error(result.message || "Failed to update studio");
        return;
      }

      toast.success("Studio updated successfully!");

      router.push("/my-listings");
      router.refresh();
    } catch (err) {
      console.error("Update Studio Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (isPending || !user || isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F5F0E8]">
        <span className="loading loading-spinner loading-lg text-[#D4AD68]" />
      </div>
    );
  }

  // Error State
  if (error || !studio) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F5F0E8] px-4 text-center">
        <h1 className="font-heading text-2xl font-bold text-[#22252A]">
          Unable to Edit Studio
        </h1>

        <p className="mt-3 text-sm text-red-600">
          {error || "Studio not found"}
        </p>

        <Link
          href="/my-listings"
          className="mt-6 rounded-lg bg-[#D4AD68] px-6 py-3 text-sm font-semibold text-[#22252A]"
        >
          Back to My Listings
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-4xl">

        {/* Back Link */}
        <Link
          href="/my-listings"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#22252A]"
        >
          <ArrowLeft size={17} />
          Back to My Listings
        </Link>

        {/* Heading */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B58B49]">
            Studio Management
          </p>

          <h1 className="font-heading text-3xl font-bold text-[#22252A] sm:text-4xl">
            Edit Your Studio
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            Update your studio details and keep your listing accurate.
          </p>
        </div>

        {/* Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-6 shadow-sm sm:p-10"
        >

          {/* Basic Information */}
          <section>
            <SectionHeading
              icon={<Building2 size={20} />}
              title="Basic Information"
            />

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div className="md:col-span-2">
                <FormLabel>Studio Title</FormLabel>

                <input
                  name="title"
                  type="text"
                  defaultValue={studio.title}
                  required
                  className="edit-input"
                />
              </div>

              <div>
                <FormLabel>Category</FormLabel>

                <select
                  name="category"
                  defaultValue={studio.category}
                  required
                  className="edit-input"
                >
                  {!categories.includes(studio.category) && (
                    <option value={studio.category}>
                      {studio.category}
                    </option>
                  )}

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
                  name="maxCapacity"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue={studio.maxCapacity}
                  required
                  className="edit-input"
                />
              </div>

            </div>
          </section>

          {/* Pricing */}
          <section className="border-t border-[#E8E0D4] pt-8">
            <SectionHeading
              icon={<DollarSign size={20} />}
              title="Pricing Details"
            />

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <FormLabel>Hourly Rate (BDT)</FormLabel>

                <input
                  name="hourlyRate"
                  type="number"
                  min="1"
                  step="0.01"
                  defaultValue={studio.hourlyRate}
                  required
                  className="edit-input"
                />
              </div>

              <div>
                <FormLabel>Security Deposit (BDT)</FormLabel>

                <input
                  name="securityDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={studio.securityDeposit}
                  required
                  className="edit-input"
                />
              </div>

            </div>
          </section>

          {/* Location */}
          <section className="border-t border-[#E8E0D4] pt-8">
            <SectionHeading
              icon={<MapPin size={20} />}
              title="Studio Location"
            />

            <div className="mt-6">
              <FormLabel>Full Address</FormLabel>

              <input
                name="location"
                type="text"
                defaultValue={studio.location}
                required
                className="edit-input"
              />
            </div>
          </section>


          {/* Studio Image */}
          <section className="border-t border-[#E8E0D4] pt-8">
            <SectionHeading
              icon={<Camera size={20} />}
              title="Studio Image"
            />

            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-600">
                Your current studio image is shown below.
                Upload a new image only if you want to replace it.
              </p>

              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
              />

              {!imageUrl && (
                <p className="text-sm text-red-600">
                  Please upload an image before saving your changes.
                </p>
              )}
            </div>
          </section>


          {/* Amenities */}
          <section className="border-t border-[#E8E0D4] pt-8">
            <SectionHeading
              icon={<Users size={20} />}
              title="Amenities"
            />

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">

              {amenitiesList.map((amenity) => {
                const selected = selectedAmenities.includes(amenity);

                return (
                  <label
                    key={amenity}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition ${selected
                      ? "border-[#D4AD68] bg-[#D4AD68]/10"
                      : "border-[#E8E0D4] hover:border-[#D4AD68]"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleAmenityChange(amenity)}
                      className="checkbox checkbox-sm checked:border-[#D4AD68] checked:bg-[#D4AD68]"
                    />

                    {amenity}
                  </label>
                );
              })}

            </div>
          </section>

          {/* Overview */}
          <section className="border-t border-[#E8E0D4] pt-8">
            <FormLabel>Detailed Overview</FormLabel>

            <textarea
              name="overview"
              rows={6}
              defaultValue={studio.overview}
              required
              className="edit-input resize-y"
            />
          </section>

          {/* Owner */}
          <section className="border-t border-[#E8E0D4] pt-8">
            <SectionHeading
              icon={<Users size={20} />}
              title="Owner Information"
            />

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <FormLabel>Owner Name</FormLabel>

                <input
                  value={user.name}
                  readOnly
                  className="edit-input bg-gray-100"
                />
              </div>

              <div>
                <FormLabel>Owner Email</FormLabel>

                <input
                  value={user.email}
                  readOnly
                  className="edit-input bg-gray-100"
                />
              </div>

            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-[#E8E0D4] pt-8 sm:flex-row sm:justify-end">

            <Link
              href="/my-listings"
              className="rounded-lg border border-[#E8E0D4] px-6 py-3 text-center text-sm font-semibold text-[#22252A] hover:bg-[#F5F0E8]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4AD68] px-6 py-3 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53] disabled:opacity-60"
            >
              <Save size={17} />

              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>

          </div>
        </form>
      </div>

      <style jsx global>{`
        .edit-input {
          width: 100%;
          margin-top: 0.5rem;
          border: 1px solid #ded6c9;
          border-radius: 0.5rem;
          background: #fffcf7;
          padding: 0.85rem 1rem;
          color: #22252a;
          font-size: 0.875rem;
          outline: none;
        }

        .edit-input:focus {
          border-color: #d4ad68;
        }

        .edit-input:read-only {
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
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AD68]/15 text-[#A77C3F]">
        {icon}
      </div>

      <h2 className="font-heading text-lg font-bold text-[#22252A]">
        {title}
      </h2>
    </div>
  );
}