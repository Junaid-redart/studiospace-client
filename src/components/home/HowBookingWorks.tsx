
import Link from "next/link";

import {
  ArrowRight,
  Search,
  CalendarDays,
  CheckCircle2,
  Clapperboard,
} from "lucide-react";

const bookingSteps = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Explore photography studios, podcast rooms, music suites and creative workspaces.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description:
      "Choose your preferred date, start time and end time based on your schedule.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Book Instantly",
    description:
      "Submit your booking request with transparent pricing and track its status.",
    icon: CheckCircle2,
  },
  {
    number: "04",
    title: "Create & Produce",
    description:
      "Once your reservation is confirmed, get ready to bring your vision to life.",
    icon: Clapperboard,
  },
];

export default function HowBookingWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[#22252A] px-5 py-16 text-white lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AD68]">
            Simple & Seamless
          </p>

          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            How Booking{" "}
            <span className="text-[#D4AD68]">
              Works
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-300">
            From finding your perfect studio to creating
            your next masterpiece, booking is simple.
          </p>
        </div>

        {/* Booking Steps */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {bookingSteps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-[#2D3035] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D4AD68]/60"
              >
                {/* Step Number */}
                <span className="absolute right-6 top-5 text-5xl font-bold text-white/10">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4AD68]/15 text-[#D4AD68]">
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                {/* Step Content */}
                <h3 className="font-heading text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-gray-300">
                  {step.description}
                </p>

                <div className="mt-7 h-1 w-12 rounded-full bg-[#D4AD68] transition-all duration-300 group-hover:w-20" />
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AD68] px-7 py-3.5 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53]"
          >
            Explore Studios
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
