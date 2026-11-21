
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Camera,
  Headset,
  Sparkles,
} from "lucide-react";

const guarantees = [
  {
    icon: BadgeCheck,
    title: "Verified Hosts",
    description:
      "We're working toward trusted host profiles and clear studio information to help creators book with confidence.",
  },
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    description:
      "We aim to build transparent booking policies and protection guidelines for both creators and studio hosts.",
  },
  {
    icon: Camera,
    title: "Equipment Safety",
    description:
      "Review listed amenities and studio facilities before booking to prepare for a safe creative session.",
  },
  {
    icon: Headset,
    title: "Creator Support",
    description:
      "We're building better support experiences to help creators with bookings and studio-related questions.",
  },
];

export default function HostGuarantee() {
  return (
    <section
      id="host-guarantee"
      className="bg-[#FFFCF7] px-5 py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B58B49]">
            Built Around Creative Confidence
          </p>

          <h2 className="font-heading text-3xl font-bold text-[#22252A] sm:text-4xl">
            Host Guarantee &{" "}
            <span className="text-[#B58B49]">
              Creator Support
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-600">
            Great creative work deserves a reliable space.
            Discover our approach to trust, safety, and
            better experiences for creators and hosts.
          </p>
        </div>

        {/* Guarantee Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="group flex h-full flex-col rounded-2xl border border-[#E8E0D4] bg-[#F5F0E8] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D4AD68] hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AD68]/20 text-[#A77C3F] transition group-hover:bg-[#D4AD68] group-hover:text-[#22252A]">
                  <Icon size={30} strokeWidth={1.8} />
                </div>

                <h3 className="font-heading text-xl font-bold text-[#22252A]">
                  {item.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-gray-600">
                  {item.description}
                </p>

                <div className="mt-7 h-1 w-12 rounded-full bg-[#D4AD68] transition-all duration-300 group-hover:w-20" />
              </article>
            );
          })}
        </div>

        {/* Host Call to Action */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-[#22252A] p-8 text-white sm:p-12">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AD68]/15 text-[#D4AD68]">
                <Sparkles size={25} />
              </div>

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AD68]">
                Become a Studio Host
              </p>

              <h3 className="font-heading text-2xl font-bold sm:text-3xl">
                Your Space Could Inspire
                Someone Next Big Idea.
              </h3>

              <p className="mt-4 text-sm leading-7 text-gray-300">
                Have a photography studio, recording room,
                or creative workspace? List your space on
                StudioSpace and connect with creators
                looking for their next project location.
              </p>
            </div>

            <Link
              href="/add-studio"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4AD68] px-7 py-4 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53]"
            >
              List Your Studio
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
