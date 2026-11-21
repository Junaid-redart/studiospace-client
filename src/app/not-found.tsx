
import Link from "next/link";
import {
  Aperture,
  ArrowLeft,
  Search,
  Camera,
  Clapperboard,
} from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#F5F0E8] px-5 py-16 dark:bg-[#14171C]">
      <div className="mx-auto max-w-2xl text-center">

        {/* Creative Illustration */}
        <div className="relative mx-auto mb-8 flex h-52 w-64 items-center justify-center">

          <div className="absolute left-4 top-5 -rotate-12 rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-5 shadow-lg dark:border-[#414650] dark:bg-[#22262E]">
            <Camera
              size={45}
              className="text-[#D4AD68]"
            />
          </div>

          <div className="absolute right-4 top-10 rotate-12 rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-5 shadow-lg dark:border-[#414650] dark:bg-[#22262E]">
            <Clapperboard
              size={45}
              className="text-[#D4AD68]"
            />
          </div>

          <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-8 border-[#F5F0E8] bg-[#22252A] shadow-xl dark:border-[#14171C]">
            <Search
              size={52}
              className="text-[#D4AD68]"
            />
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <Aperture
            size={30}
            className="text-[#B58B49]"
          />

          <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#B58B49]">
            StudioSpace
          </span>
        </div>

        <h1 className="font-heading text-7xl font-extrabold tracking-tight text-[#22252A] dark:text-[#F5F0E8] sm:text-8xl">
          404
        </h1>

        <h2 className="mt-5 font-heading text-2xl font-bold text-[#22252A] dark:text-[#F5F0E8] sm:text-3xl">
          This Scene Wasn&apos;t Found
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-gray-600 dark:text-[#BAC0CA] sm:text-base">
          Looks like this creative space is missing from the set.
          The page may have moved, or the link might be incorrect.
          Let&apos;s get you back to discovering amazing studios.
        </p>

        {/* Navigation Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AD68] px-7 py-4 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53] sm:w-auto"
          >
            <ArrowLeft size={18} />
            Return to Home
          </Link>

          <Link
            href="/studios"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D4AD68] px-7 py-4 text-sm font-bold text-[#22252A] transition hover:bg-[#D4AD68]/10 dark:text-[#F5F0E8] sm:w-auto"
          >
            <Search size={18} />
            Explore Studios
          </Link>

        </div>

        <p className="mt-12 text-xs text-gray-500 dark:text-[#BAC0CA]">
          Error 404 — Page Not Found
        </p>

      </div>
    </main>
  );
}
