import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 90, 95],
  },
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
