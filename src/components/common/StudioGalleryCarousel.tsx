
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

interface StudioGalleryCarouselProps {
  images?: string[];
  imageUrl?: string;
  title: string;
}

export default function StudioGalleryCarousel({
  images,
  imageUrl,
  title,
}: StudioGalleryCarouselProps) {
  const galleryImages = Array.from(
    new Set(
      [
        ...(images ?? []),
        ...(imageUrl ? [imageUrl] : []),
      ].filter((url) => typeof url === "string" && url.trim() !== "")
    )
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const currentIndex =
    activeIndex < galleryImages.length ? activeIndex : 0;

  const showPrevious = () => {
    setActiveIndex(
      (currentIndex - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const showNext = () => {
    setActiveIndex((currentIndex + 1) % galleryImages.length);
  };

  useEffect(() => {
    if (galleryImages.length <= 1) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Avoid interfering with text inputs and other page controls.
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
          target.isContentEditable)
      ) {
        return;
      }

      // Keyboard navigation is handled by the focused carousel buttons.
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryImages.length]);

  if (galleryImages.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-[#F5F0E8] text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <Images size={40} />
          <p className="text-sm">No studio images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-2xl bg-[#F5F0E8]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={galleryImages[currentIndex]}
          alt={`${title} - Photo ${currentIndex + 1}`}
          className="aspect-video w-full object-cover"
        />

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-4 py-2 text-xs font-semibold text-white">
          {currentIndex + 1} / {galleryImages.length}
        </div>

        {/* Navigation Buttons */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous studio image"
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#22252A] shadow-md transition hover:bg-white"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next studio image"
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#22252A] shadow-md transition hover:bg-white"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {galleryImages.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View studio photo ${index + 1}`}
              aria-pressed={currentIndex === index}
              className={`overflow-hidden rounded-lg border-2 transition ${
                currentIndex === index
                  ? "border-[#D4AD68] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${title} thumbnail ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
