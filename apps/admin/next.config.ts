import type { NextConfig } from "next";
import path from "node:path";
import dotenv from "dotenv";

// Load single root .env across monorepo workspace
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

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