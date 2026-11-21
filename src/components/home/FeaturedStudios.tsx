
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  MapPin,
  Users,
  Building2,
  RefreshCw,
} from "lucide-react";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
}

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadFeaturedStudios = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/studios/featured`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load featured studios.");
        }

        const result = await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid studio data received.");
        }

        setStudios(result.data);
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

    loadFeaturedStudios();

    return () => controller.abort();
  }, [retryKey]);

  return (
    <section
      id="featured-studios"
      className="bg-[#F5F0E8] px-5 py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B58B49]">
              Handpicked Creative Spaces
            </p>

            <h2 className="font-heading text-3xl font-bold text-[#22252A] sm:text-4xl">
              Featured{" "}
              <span className="text-[#B58B49]">Studios</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600">
              Explore our newest creative workspaces and find
              the perfect place for your next project.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D4AD68] px-5 py-3 text-sm font-semibold text-[#22252A] transition hover:bg-[#D4AD68]"
          >
            Explore All Studios
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-[#FFFCF7]"
              >
                <div className="skeleton h-56 w-full rounded-none" />

                <div className="space-y-4 p-6">
                  <div className="skeleton h-5 w-28" />
                  <div className="skeleton h-7 w-4/5" />
                  <div className="skeleton h-5 w-1/2" />
                  <div className="skeleton h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-[#FFFCF7] p-10 text-center">
            <h3 className="text-xl font-bold text-[#22252A]">
              Unable to Load Featured Studios
            </h3>

            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetryKey((key) => key + 1)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#D4AD68] px-5 py-3 text-sm font-bold text-[#22252A]"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && studios.length === 0 && (
          <div className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] px-6 py-16 text-center">
            <Building2
              size={38}
              className="mx-auto text-[#B58B49]"
            />

            <h3 className="mt-5 text-xl font-bold text-[#22252A]">
              New Studios Coming Soon
            </h3>

            <p className="mt-3 text-sm text-gray-600">
              Creative spaces will appear here as hosts list them.
            </p>
          </div>
        )}

        {/* Featured Studio Cards */}
        {!isLoading && !error && studios.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-[#E8E0D4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={studio.imageUrl}
                    alt={studio.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 max-w-[85%] rounded-full bg-[#FFFCF7] px-3 py-1.5 text-xs font-semibold text-[#9B7135] shadow-sm">
                    {studio.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-xl font-bold text-[#22252A]">
                    {studio.title}
                  </h3>

                  <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-[#B58B49]"
                    />
                    <span>{studio.location}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <Users size={17} className="text-[#B58B49]" />
                    <span>Up to {studio.maxCapacity} people</span>
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="mb-5 flex items-baseline gap-1 border-t border-[#E8E0D4] pt-5">
                      <span className="text-2xl font-bold text-[#22252A]">
                        ${studio.hourlyRate.toLocaleString()}
                      </span>

                      <span className="text-sm text-gray-500">
                        / hour
                      </span>
                    </div>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#22252A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#D4AD68] hover:text-[#22252A]"
                    >
                      View Details
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
