
import Link from "next/link";

import {
  Aperture,
  ArrowRight,
  Camera,
  Clapperboard,
  Compass,
  HeartHandshake,
  Lightbulb,
  Mic2,
  Music2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const creativeFields = [
  { name: "Photography", icon: Camera },
  { name: "Filmmaking", icon: Clapperboard },
  { name: "Podcasting", icon: Mic2 },
  { name: "Music Production", icon: Music2 },
];

const values = [
  {
    icon: Compass,
    title: "Easy Discovery",
    description:
      "Find creative workspaces that match your project, location, and budget.",
  },
  {
    icon: HeartHandshake,
    title: "Creative Connections",
    description:
      "Bring studio hosts and creators together through a shared marketplace.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    description:
      "Explore studio amenities, capacity, hourly pricing, and booking details before sending a reservation request.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#22252A] px-5 py-20 text-white lg:px-8 lg:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#D4AD68]/15" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full border border-[#D4AD68]/10" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#D4AD68]">
              <Sparkles size={16} />
              The Story Behind StudioSpace
            </p>

            <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Great Ideas Deserve
              <span className="block text-[#D4AD68]">
                Great Spaces.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-gray-300">
              StudioSpace connects creators with spaces built for
              imagination. Whether you are capturing portraits,
              filming your next project, recording a podcast, or
              producing music, finding the right workspace should
              feel simple and inspiring.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/studios"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D4AD68] px-6 py-3.5 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53]"
              >
                Explore Studios
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/add-studio"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#D4AD68] hover:text-[#D4AD68]"
              >
                Become a Host
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About StudioSpace */}
      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B58B49]">
              Who We Are
            </p>

            <h2 className="font-heading text-3xl font-bold leading-tight text-[#22252A] sm:text-4xl">
              A Marketplace for
              <span className="text-[#B58B49]"> Creative Possibilities.</span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-gray-600">
              StudioSpace is a peer-to-peer creative workspace
              sharing platform. Studio owners can list their
              spaces, while photographers, filmmakers,
              podcasters, musicians, and other creators can
              discover and request reservations for those
              spaces.
            </p>

            <p className="mt-4 text-sm leading-8 text-gray-600">
              Our goal is to make creative spaces easier to
              discover while giving hosts a place to showcase
              their studios and connect with new audiences.
            </p>
          </div>

          {/* Creative Fields Card */}
          <div className="rounded-3xl border border-[#E8E0D4] bg-[#FFFCF7] p-7 shadow-sm sm:p-9">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AD68]/20 text-[#A77C3F]">
                <Aperture size={26} />
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#22252A]">
                  Made for Creators
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  One platform. Many creative disciplines.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {creativeFields.map((field) => {
                const Icon = field.icon;

                return (
                  <div
                    key={field.name}
                    className="flex min-h-32 flex-col items-center justify-center gap-4 rounded-2xl border border-[#E8E0D4] bg-[#F5F0E8] p-4 text-center"
                  >
                    <Icon
                      size={28}
                      className="text-[#A77C3F]"
                      strokeWidth={1.8}
                    />

                    <span className="text-sm font-semibold text-[#22252A]">
                      {field.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="bg-[#FFFCF7] px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B58B49]">
              What Drives Us
            </p>

            <h2 className="font-heading text-3xl font-bold text-[#22252A] sm:text-4xl">
              Our Mission &{" "}
              <span className="text-[#B58B49]">Vision</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-[#E8E0D4] bg-[#F5F0E8] p-8 sm:p-10">
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4AD68]/20 text-[#A77C3F]">
                <Lightbulb size={28} />
              </div>

              <h3 className="font-heading text-2xl font-bold text-[#22252A]">
                Our Mission
              </h3>

              <p className="mt-5 text-sm leading-8 text-gray-600">
                To simplify studio discovery and booking,
                helping creators find spaces that support
                their ideas while giving studio hosts an
                accessible way to share their facilities.
              </p>
            </article>

            <article className="rounded-2xl border border-[#E8E0D4] bg-[#F5F0E8] p-8 sm:p-10">
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4AD68]/20 text-[#A77C3F]">
                <Users size={28} />
              </div>

              <h3 className="font-heading text-2xl font-bold text-[#22252A]">
                Our Vision
              </h3>

              <p className="mt-5 text-sm leading-8 text-gray-600">
                A creative community where access to the
                right workspace is easier, collaboration
                grows, and every studio has an opportunity
                to reach its ideal audience.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Why StudioSpace */}
      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B58B49]">
              The StudioSpace Experience
            </p>

            <h2 className="font-heading text-3xl font-bold text-[#22252A] sm:text-4xl">
              Why Choose{" "}
              <span className="text-[#B58B49]">StudioSpace?</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-8 shadow-sm"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4AD68]/20 text-[#A77C3F]">
                    <Icon size={27} />
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#22252A]">
                    {value.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-gray-600">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#22252A] px-5 py-16 text-white lg:px-8 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AD68]">
              Your Next Project Starts Here
            </p>

            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Ready to Find Your Creative Space?
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-300">
              Discover available studios and take the next
              step toward bringing your vision to life.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D4AD68] px-7 py-4 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53]"
          >
            Explore Studios
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
