
import Link from "next/link";

import {
    Aperture,
    ArrowUpRight,
    Mail,
    MapPin,
} from "lucide-react";

const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/about" },
    { name: "List Your Studio", href: "/add-studio" },
];

const categories = [
    {
        name: "Photography Studios",
        value: "Photography Studio",
    },
    {
        name: "Film & Video",
        value: "Film & Video Studio",
    },
    {
        name: "Podcast Studios",
        value: "Podcast Studio",
    },
    {
        name: "Music Studios",
        value: "Music & Recording Studio",
    },
    {
        name: "Creative Workshops",
        value: "Event & Workshop Space",
    },
];

export default function Footer() {
    return (
        <footer className="bg-[#22252A] text-white">
            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-8 lg:pt-20">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">

                    {/* Brand */}
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3 text-[#D4AD68]"
                        >
                            <Aperture size={33} strokeWidth={1.8} />

                            <span className="font-heading text-2xl font-bold">
                                StudioSpace
                            </span>
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
                            Discover inspiring creative workspaces,
                            connect with studio hosts, and find the
                            right setting for your next production.
                        </p>

                        <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
                            <MapPin
                                size={17}
                                className="shrink-0 text-[#D4AD68]"
                            />
                            Creative spaces, wherever you need them.
                        </div>

                        {/* Social icons: profile URLs can be added later */}
                        <div className="mt-7">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Follow Our Journey
                            </p>

                            <div className="flex items-center gap-3">
                                <span
                                    title="Facebook profile coming soon"
                                    aria-label="Facebook profile coming soon"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-gray-400"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="19"
                                        height="19"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
                                    </svg>
                                </span>

                                <span
                                    title="Instagram profile coming soon"
                                    aria-label="Instagram profile coming soon"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-gray-400"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="19"
                                        height="19"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <rect x="2" y="2" width="20" height="20" rx="5" />
                                        <circle cx="12" cy="12" r="4" />
                                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                                    </svg>
                                </span>

                                {/* Current X logo, not the old Twitter bird */}
                                <span
                                    title="X profile coming soon"
                                    aria-label="X profile coming soon"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-gray-400"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="h-[18px] w-[18px] fill-current"
                                    >
                                        <path d="M18.901 2H22.18l-7.162 8.184L23.443 22h-6.595l-5.165-7.195L5.38 22H2.1l7.66-8.757L1.677 2h6.762l4.669 6.533L18.901 2Zm-1.15 18h1.817L7.451 3.894H5.5L17.751 20Z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-heading text-lg font-bold text-white">
                            Quick Links
                        </h3>

                        <div className="mt-6 flex flex-col gap-4">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="group inline-flex w-fit items-center gap-2 text-sm text-gray-400 transition hover:text-[#D4AD68]"
                                >
                                    {link.name}

                                    <ArrowUpRight
                                        size={14}
                                        className="opacity-0 transition group-hover:opacity-100"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Popular Categories */}
                    <div>
                        <h3 className="font-heading text-lg font-bold text-white">
                            Popular Categories
                        </h3>

                        <div className="mt-6 flex flex-col gap-4">
                            {categories.map((category) => (
                                <Link
                                    key={category.value}
                                    href={`/studios?category=${encodeURIComponent(
                                        category.value
                                    )}`}
                                    className="w-fit text-sm text-gray-400 transition hover:text-[#D4AD68]"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-heading text-lg font-bold text-white">
                            Stay Inspired
                        </h3>

                        <p className="mt-6 text-sm leading-7 text-gray-400">
                            We are preparing updates about new studios,
                            creative ideas, and platform news.
                        </p>

                        <div className="relative mt-6">
                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AD68]"
                            />

                            <input
                                type="email"
                                placeholder="Your email address"
                                aria-label="Newsletter email address"
                                disabled
                                className="w-full rounded-xl border border-white/15 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 disabled:cursor-not-allowed"
                            />
                        </div>

                        <p className="mt-3 text-xs text-gray-500">
                            Newsletter subscriptions coming soon.
                        </p>

                        <Link
                            href="/studios"
                            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#D4AD68] transition hover:text-white"
                        >
                            Discover New Studios
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-center text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">

                    <p>
                        © {new Date().getFullYear()} StudioSpace.
                        All rights reserved.
                    </p>

                    <p>
                        Built for creators, by creators.
                    </p>

                    <p>
                        Terms & Privacy information coming soon.
                    </p>
                </div>
            </div>
        </footer>
    );
}
