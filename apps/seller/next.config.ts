import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile internal workspace packages
  transpilePackages: ["@needlon/ui", "@needlon/db", "@needlon/modules"],
};

export default nextConfig;