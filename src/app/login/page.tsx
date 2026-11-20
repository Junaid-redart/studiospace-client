"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Aperture } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email: email.trim(),
                password,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password");
                return;
            }

            toast.success("Welcome back to StudioSpace!");

            router.push("/");
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle =
        "w-full rounded-xl border border-[#DDD5C8] bg-[#FFFCF7] px-4 py-3 text-sm text-[#252525] outline-none transition focus:border-[#D4AD68] focus:ring-2 focus:ring-[#D4AD68]/20";

    return (
        <main className="flex flex-1 items-center justify-center bg-[#F5F0E8] px-4 py-12 sm:px-6 lg:px-8">

            <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-[#FFFCF7] shadow-xl shadow-black/5 lg:grid-cols-2">

                {/* Left Section */}
                <div className="relative hidden flex-col justify-between bg-[#22252A] p-12 text-white lg:flex">

                    <div>
                        <div className="flex items-center gap-3 text-[#D4AD68]">
                            <Aperture size={34} />

                            <span className="text-2xl font-bold">
                                StudioSpace
                            </span>
                        </div>

                        <div className="mt-24">
                            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AD68]">
                                Welcome Back
                            </p>

                            <h1 className="text-4xl font-bold leading-tight">
                                Your next big
                                <br />
                                creation starts
                                <br />
                                right here.
                            </h1>

                            <p className="mt-6 max-w-sm leading-7 text-gray-300">
                                Sign in to explore inspiring creative spaces,
                                manage your studio listings, and bring your
                                next production to life.
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400">
                        Create. Connect. Inspire.
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-12 lg:py-16">

                    <div className="mb-8">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#B88C47]">
                            Welcome Back
                        </p>

                        <h2 className="text-3xl font-bold text-[#252525]">
                            Sign In to Your Account
                        </h2>

                        <p className="mt-3 text-sm text-[#6B6B6B]">
                            Enter your credentials to continue your creative journey.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-[#252525]"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className={inputStyle}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-semibold text-[#252525]"
                                >
                                    Password
                                </label>

                                <span className="text-xs font-medium text-[#B88C47]">
                                    Forgot Password?
                                </span>
                            </div>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className={`${inputStyle} pr-12`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#B88C47]"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <Eye size={19} />
                                    ) : (
                                        <EyeOff size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AD68] px-6 py-3.5 font-semibold text-[#252525] transition hover:bg-[#C49B55] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? (
                                "Signing In..."
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="mt-8 text-center text-sm text-[#6B6B6B]">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-[#B88C47] hover:underline"
                        >
                            Create an Account
                        </Link>
                    </p>

                </div>
            </div>
        </main>
    );
}