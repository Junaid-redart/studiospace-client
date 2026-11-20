"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Aperture } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain an uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain a lowercase letter");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoURL.trim(),
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");

      router.push("/login");
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

        {/* Left Side */}
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
                Your Creative Journey Starts Here
              </p>

              <h1 className="text-4xl font-bold leading-tight">
                Every great idea
                <br />
                deserves the
                <br />
                perfect space.
              </h1>

              <p className="mt-6 max-w-sm leading-7 text-gray-300">
                Join a community of creators discovering inspiring
                studios for photography, filmmaking, podcasts,
                music, and more.
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            Create. Connect. Inspire.
          </p>
        </div>

        {/* Right Side */}
        <div className="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">

          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#B88C47]">
              Join StudioSpace
            </p>

            <h2 className="text-3xl font-bold text-[#252525]">
              Create Your Account
            </h2>

            <p className="mt-3 text-sm text-[#6B6B6B]">
              Sign up to discover and share creative spaces.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[#252525]"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                required
              />
            </div>

            {/* Photo URL */}
            <div>
              <label
                htmlFor="photo"
                className="mb-2 block text-sm font-semibold text-[#252525]"
              >
                Photo URL
              </label>

              <input
                id="photo"
                type="url"
                placeholder="https://example.com/photo.jpg"
                className={inputStyle}
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#252525]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`${inputStyle} pr-12`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#B88C47]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-[#777777]">
                Minimum 6 characters, including uppercase and lowercase letters.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AD68] px-6 py-3.5 font-semibold text-[#252525] transition hover:bg-[#C49B55] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-7 text-center text-sm text-[#6B6B6B]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#B88C47] hover:underline"
            >
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}