"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    title: "Create Without Limits",
    description:
      "Discover extraordinary creative spaces for photography, filmmaking, and your next big production.",
  image: "/images/hero/hero-photography.png",
  },
  {
    id: 2,
    title: "Your Voice Deserves a Space",
    description:
      "Find professional recording environments designed for podcasts, music, and powerful conversations.",
   image: "/images/hero/hero-podcast.png",
  },
  {
    id: 3,
    title: "Bring Your Vision to Life",
    description:
      "Explore inspiring production spaces where creative ideas become unforgettable experiences.",
   image: "/images/hero/hero-film.png",
  },
];

export default function HeroSlider() {
  return (
    <section className="studio-hero relative w-full">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        loop={true}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative flex min-h-[520px] items-center bg-cover bg-center bg-no-repeat md:min-h-[620px]"
              style={{
                backgroundImage: `linear-gradient(
                  90deg,
                  rgba(18, 20, 23, 0.92) 0%,
                  rgba(18, 20, 23, 0.65) 42%,
                  rgba(18, 20, 23, 0.15) 100%
                ), url("${slide.image}")`,
              }}
            >
              <div className="mx-auto w-full max-w-7xl px-5 py-20 lg:px-8">
                <div className="max-w-2xl">

                  {/* Small Label */}
                  <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AD68]">
                    Discover Your Creative Space
                  </p>

                  {/* Hero Heading */}
                  <h1 className="mb-6 text-4xl font-bold leading-tight text-[#FFFCF7] sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="mb-9 max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
                    {slide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/studios"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#D4AD68] px-6 py-3.5 font-semibold text-[#22252A] transition-all duration-300 hover:bg-[#C49A53]"
                    >
                      Explore Studios
                      <ArrowRight size={19} />
                    </Link>

                    <Link
                      href="/add-studio"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#FFFCF7] px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#22252A]"
                    >
                      Host Your Space
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}