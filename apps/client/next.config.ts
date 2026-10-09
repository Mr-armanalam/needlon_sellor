import type { NextConfig } from "next";

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
    // dangerouslyAllowLocalIP: true,
  },
  transpilePackages: ["@needlon/ui", "@needlon/db", "@needlon/client-packages", "@needlon/modules"],
};

export default nextConfig;
