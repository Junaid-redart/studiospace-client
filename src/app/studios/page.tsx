
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  RefreshCw,
  Building2,
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
  amenities: string[];
  overview: string;
  ownerName: string;
}

export default function ExploreStudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  // Fetch all studios from MongoDB
  useEffect(() => {
    const controller = new AbortController();

    const loadStudios = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/studios`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load studios");
        }

        const result = await response.json();

        // Accept either { data: [...] } or a direct array
        const studioList = Array.isArray(result)
          ? result
          : result.data;

        if (!Array.isArray(studioList)) {
          throw new Error("Invalid studio data received");
        }

        setStudios(studioList);
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

    loadStudios();

    return () => controller.abort();
  }, [reloadKey]);

  // Categories come from actual MongoDB data
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(studios.map((studio) => studio.category)),
    ];

    return ["All Categories", ...uniqueCategories.sort()];
  }, [studios]);

  // Search and category filtering
  const filteredStudios = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return studios.filter((studio) => {
      const matchesSearch =
        studio.title.toLowerCase().includes(searchText) ||
        studio.location.toLowerCase().includes(searchText) ||
        studio.category.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        studio.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [studios, search, selectedCategory]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All Categories");
  };

  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      {/* Page Header */}
      <section className="bg-[#22252A] px-5 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#D4AD68]">
            Discover Your Creative Space
          </p>

          <h1 className="font-heading text-4xl font-bold sm:text-5xl">
            Explore <span className="text-[#D4AD68]">Studios</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
            Find the perfect space for your next photography session,
            podcast recording, music production, or creative project.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {/* Search and Filter */}
        <div className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal size={19} className="text-[#B58B49]" />

            <h2 className="font-heading text-lg font-bold text-[#22252A]">
              Find Your Ideal Studio
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            {/* Search */}
            <label className="relative block">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search studios, locations, or categories..."
                aria-label="Search studios"
                className="w-full rounded-xl border border-[#DED6C9] bg-white py-3.5 pl-12 pr-4 text-sm text-[#22252A] outline-none transition focus:border-[#D4AD68]"
              />
            </label>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
              aria-label="Filter by category"
              className="w-full rounded-xl border border-[#DED6C9] bg-white px-4 py-3.5 text-sm text-[#22252A] outline-none transition focus:border-[#D4AD68]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="mb-7 mt-10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#22252A]">
              Available Spaces
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isLoading
                ? "Loading creative spaces..."
                : `${filteredStudios.length} ${
                    filteredStudios.length === 1 ? "studio" : "studios"
                  } found`}
            </p>
          </div>

          {(search || selectedCategory !== "All Categories") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-[#9B7135] hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-[#FFFCF7]"
              >
                <div className="skeleton h-56 w-full rounded-none" />

                <div className="space-y-4 p-6">
                  <div className="skeleton h-5 w-24" />
                  <div className="skeleton h-7 w-4/5" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-11 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-[#FFFCF7] px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-[#22252A]">
              Unable to Load Studios
            </h3>

            <p className="mt-3 text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => setReloadKey((previous) => previous + 1)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#D4AD68] px-6 py-3 text-sm font-bold text-[#22252A]"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredStudios.length === 0 && (
          <div className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F0E8] text-[#B58B49]">
              <Building2 size={30} />
            </div>

            <h3 className="mt-5 font-heading text-xl font-bold text-[#22252A]">
              No Studios Found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              No creative spaces match your search. Try another
              keyword or category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-lg bg-[#D4AD68] px-6 py-3 text-sm font-bold text-[#22252A]"
            >
              Show All Studios
            </button>
          </div>
        )}

        {/* Studio Cards */}
        {!isLoading && !error && filteredStudios.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio) => (
              <article
                key={studio._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Studio Image */}
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

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-xl font-bold leading-snug text-[#22252A]">
                    {studio.title}
                  </h3>

                  <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-[#B58B49]"
                    />
                    <span>{studio.location}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <Users size={16} className="text-[#B58B49]" />
                    <span>Up to {studio.maxCapacity} people</span>
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="mb-5 flex items-baseline gap-1 border-t border-[#E8E0D4] pt-5">
                      <span className="text-2xl font-bold text-[#22252A]">
                        ৳{studio.hourlyRate.toLocaleString()}
                      </span>

                      <span className="text-sm text-gray-500">/ hour</span>
                    </div>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22252A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#D4AD68] hover:text-[#22252A]"
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
    </main>
  );
}
