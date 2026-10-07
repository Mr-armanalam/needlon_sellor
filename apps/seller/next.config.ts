import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile internal workspace packages
  transpilePackages: ["@needlon/ui", "@needlon/db", "@needlon/modules"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;