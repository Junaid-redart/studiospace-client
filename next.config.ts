
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Forward frontend API requests to Express backend
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_API_URL is not configured."
      );
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
