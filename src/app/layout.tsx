
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/providers/ThemeProvider";

import { Toaster } from "sonner";

// Heading Font
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

// Body Font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Website Metadata
export const metadata: Metadata = {
  title: "StudioSpace | Creative Studio Booking Platform",
  description:
    "Discover and book creative studios for photography, filmmaking, podcasting, music production, and more.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <Navbar />

          {children}

          <Toaster
            position="top-right"
            richColors
            closeButton
          />

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
