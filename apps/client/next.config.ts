import type { NextConfig } from "next";
import path from "node:path";
import dotenv from "dotenv";

// Load single root .env across monorepo workspace
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pwkubxblrpjjffvwufor.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  transpilePackages: ["@needlon/ui", "@needlon/db", "@needlon/client-packages", "@needlon/modules"],
};

export default nextConfig;
