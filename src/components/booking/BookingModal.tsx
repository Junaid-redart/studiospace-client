
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock3, X } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  studio: {
    _id: string;
    title: string;
    hourlyRate: number;
    securityDeposit: number;
  };
}

export default function BookingModal({
  isOpen,
  onClose,
  studio,
}: BookingModalProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Convert time to minutes
  const toMinutes = (time: string) => {
    if (!time) return 0;

    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const duration =
    startTime && endTime
      ? (toMinutes(endTime) - toMinutes(startTime)) / 60
      : 0;

  const validDuration = Number.isFinite(duration) && duration > 0;

  const studioRent = validDuration
    ? Number((duration * studio.hourlyRate).toFixed(2))
    : 0;

  const totalAmount = Number(
    (studioRent + studio.securityDeposit).toFixed(2)
  );

  // Local calendar date, not UTC date
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const handleBooking = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (isPending) {
      toast.error("Checking your login session.");
      return;
    }

    if (!session?.user) {
      toast.error("Please login to book a studio.");
      onClose();
      router.push("/login");
      return;
    }

    if (!bookingDate || !startTime || !endTime) {
      toast.error("Please select booking date and time.");
      return;
    }

    if (bookingDate < today) {
      toast.error("Please select today or a future date.");
      return;
    }

    if (!validDuration) {
      toast.error("End time must be after start time.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            studioId: studio._id,
            bookingDate,
            startTime,
            endTime,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Booking failed.");
        return;
      }

      toast.success("Booking request submitted successfully!");

      setBookingDate("");
      setStartTime("");
      setEndTime("");

      onClose();

      router.push("/my-bookings");
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="my-auto w-full max-w-lg rounded-2xl bg-[#FFFCF7] p-6 shadow-2xl sm:p-8"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#B58B49]">
              Reserve Your Space
            </p>

            <h2
              id="booking-modal-title"
              className="mt-2 font-heading text-2xl font-bold text-[#22252A]"
            >
              Book This Studio
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {studio.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close booking modal"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-[#F5F0E8] disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleBooking} className="space-y-5">
          {/* Booking Date */}
          <div>
            <label
              htmlFor="booking-date"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#22252A]"
            >
              <CalendarDays size={17} className="text-[#B58B49]" />
              Booking Date
            </label>

            <input
              id="booking-date"
              type="date"
              min={today}
              value={bookingDate}
              onChange={(event) => setBookingDate(event.target.value)}
              required
              className="w-full rounded-xl border border-[#DED6C9] bg-white px-4 py-3 text-sm text-[#22252A] outline-none focus:border-[#D4AD68]"
            />
          </div>

          {/* Start and End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start-time"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#22252A]"
              >
                <Clock3 size={17} className="text-[#B58B49]" />
                Start Time
              </label>

              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                required
                className="w-full rounded-xl border border-[#DED6C9] bg-white px-3 py-3 text-sm text-[#22252A] outline-none focus:border-[#D4AD68]"
              />
            </div>

            <div>
              <label
                htmlFor="end-time"
                className="mb-2 block text-sm font-semibold text-[#22252A]"
              >
                End Time
              </label>

              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                required
                className="w-full rounded-xl border border-[#DED6C9] bg-white px-3 py-3 text-sm text-[#22252A] outline-none focus:border-[#D4AD68]"
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="rounded-xl border border-[#E8E0D4] bg-[#F5F0E8] p-5">
            <h3 className="mb-4 font-heading font-bold text-[#22252A]">
              Price Summary
            </h3>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between gap-3">
                <span>Hourly Rate</span>
                <span>৳{studio.hourlyRate.toLocaleString()}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Duration</span>
                <span>
                  {validDuration
                    ? `${duration.toFixed(2)} hours`
                    : "Select time"}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Studio Rent</span>
                <span>৳{studioRent.toLocaleString()}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Security Deposit</span>
                <span>
                  ৳{studio.securityDeposit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between gap-3 border-t border-[#DED6C9] pt-4 font-bold text-[#22252A]">
              <span>Estimated Total</span>
              <span className="text-xl">
                ৳{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-xs leading-5 text-gray-500">
            Your booking will be submitted as Pending.
            The final amount is calculated by the server.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-[#DED6C9] px-4 py-3 text-sm font-semibold text-[#22252A] transition hover:bg-[#F5F0E8] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isPending || !validDuration}
              className="flex-1 rounded-xl bg-[#D4AD68] px-4 py-3 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53] disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
