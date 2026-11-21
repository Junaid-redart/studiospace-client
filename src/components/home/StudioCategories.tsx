
import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Mic,
  Music2,
  Palette,
  Users,
} from "lucide-react";

const categories = [
  {
    name: "Photography Studios",
    description: "Portraits, products & professional shoots",
    category: "Photography Studio",
    icon: Camera,
  },
  {
    name: "Film & Video",
    description: "Creative sets for cinematic productions",
    category: "Film & Video Studio",
    icon: Clapperboard,
  },
  {
    name: "Podcast Lounges",
    description: "Record conversations with clarity",
    category: "Podcast Studio",
    icon: Mic,
  },
  {
    name: "Music Studios",
    description: "Recording, rehearsal & production",
    category: "Music & Recording Studio",
    icon: Music2,
  },
  {
    name: "Art & Creative",
    description: "Inspiring spaces for artists",
    category: "Art & Creative Studio",
    icon: Palette,
  },
  {
    name: "Event & Workshops",
    description: "Spaces for hands-on collaboration",
    category: "Event & Workshop Space",
    icon: Users,
  },
];

export default function StudioCategories() {
  return (
    <section
      id="studio-categories"
      className="bg-[#FFFCF7] px-5 py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B58B49]">
            Find Your Creative Fit
          </p>

          <h2 className="font-heading text-3xl font-bold text-[#22252A] sm:text-4xl">
            Browse by{" "}
            <span className="text-[#B58B49]">
              Studio Category
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600">
            Every creative project deserves the right space.
            Explore studios designed for your work.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.category}
                href={`/studios?category=${encodeURIComponent(
                  item.category
                )}`}
                className="group relative flex min-h-48 flex-col justify-between rounded-2xl border border-[#E8E0D4] bg-[#F5F0E8] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D4AD68] hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4AD68]/20 text-[#A77C3F]">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <ArrowUpRight
                    size={21}
                    className="text-gray-400 transition group-hover:text-[#B58B49]"
                  />
                </div>

                <div className="mt-6">
                  <h3 className="font-heading text-xl font-bold text-[#22252A]">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
