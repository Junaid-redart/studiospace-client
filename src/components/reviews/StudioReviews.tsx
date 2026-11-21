
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Star, Send, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface StudioReviewsProps {
  studioId: string;
  ownerEmail: string;
}

export default function StudioReviews({
  studioId,
  ownerEmail,
}: StudioReviewsProps) {
  const { data: session, isPending } = authClient.useSession();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");

  const isOwner =
    !!session?.user?.email &&
    session.user.email.toLowerCase() ===
      ownerEmail.toLowerCase();

  const myReview = reviews.find(
    (review) => review.userId === session?.user?.id
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/studio/${studioId}`,
          {
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load reviews"
          );
        }

        if (controller.signal.aborted) return;

        setReviews(result.data || []);
        setAverageRating(result.averageRating || 0);
        setTotalReviews(result.totalReviews || 0);
        setError("");
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load reviews"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => controller.abort();
  }, [studioId, refreshKey]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!session?.user || isOwner) return;

    if (comment.trim().length < 5) {
      toast.error("Review must contain at least 5 characters");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/studio/${studioId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating,
            comment: comment.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to save review"
        );
      }

      toast.success("Review saved successfully!");
      setComment("");
      setRating(5);
      setLoading(true);
      setRefreshKey((previous) => previous + 1);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#E8E0D4] bg-[#FFFCF7] p-6 dark:border-[#414650] dark:bg-[#22262E] sm:p-8">
      <h2 className="text-xl font-bold text-[#22252A] dark:text-[#F5F0E8]">
        Guest Reviews
      </h2>

      {/* Rating Summary */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Star
          size={24}
          className="fill-[#D4AD68] text-[#D4AD68]"
        />

        <span className="text-2xl font-bold text-[#22252A] dark:text-white">
          {totalReviews > 0
            ? averageRating.toFixed(1)
            : "New"}
        </span>

        <span className="text-sm text-gray-500 dark:text-gray-300">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Review Form */}
      {!isPending && session?.user && !isOwner && (
        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-4 border-t border-[#E8E0D4] pt-6 dark:border-[#414650]"
        >
          <h3 className="font-semibold text-[#22252A] dark:text-white">
            {myReview ? "Update Your Review" : "Write a Review"}
          </h3>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`Rate ${value} stars`}
                aria-pressed={rating === value}
              >
                <Star
                  size={28}
                  className={
                    value <= rating
                      ? "fill-[#D4AD68] text-[#D4AD68]"
                      : "text-gray-400"
                  }
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            placeholder={
              myReview
                ? "Write your updated experience..."
                : "Share your experience with this studio..."
            }
            rows={4}
            minLength={5}
            maxLength={1000}
            required
            className="w-full rounded-xl border border-[#DDD5C8] bg-white p-4 text-sm text-[#22252A] outline-none focus:border-[#D4AD68] dark:border-[#414650] dark:bg-[#292E37] dark:text-white"
          />

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D4AD68] px-6 py-3 text-sm font-semibold text-[#22252A] disabled:opacity-60"
          >
            <Send size={17} />
            {submitting ? "Saving..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Guest Login Prompt */}
      {!isPending && !session?.user && (
        <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">
          <Link
            href="/login"
            className="font-semibold text-[#B58B49] hover:underline"
          >
            Login
          </Link>{" "}
          to write a review.
        </p>
      )}

      {isOwner && (
        <p className="mt-5 text-sm text-gray-500 dark:text-gray-300">
          Studio owners cannot review their own listings.
        </p>
      )}

      {/* Reviews List */}
      <div className="mt-8 space-y-5 border-t border-[#E8E0D4] pt-6 dark:border-[#414650]">
        {loading ? (
          <p className="text-sm text-gray-500">
            Loading reviews...
          </p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-300">
            No reviews yet. Be the first to share your experience!
          </p>
        ) : (
          reviews.map((review) => (
            <article
              key={review._id}
              className="border-b border-[#E8E0D4] pb-5 last:border-b-0 dark:border-[#414650]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AD68]/20 text-[#B58B49]">
                  <UserRound size={20} />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-[#22252A] dark:text-white">
                    {review.userName}
                  </p>

                  <div className="mt-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        size={15}
                        className={
                          value <= review.rating
                            ? "fill-[#D4AD68] text-[#D4AD68]"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-gray-600 dark:text-gray-300">
                    {review.comment}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(
                      review.updatedAt
                    ).toLocaleDateString("en-US")}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

