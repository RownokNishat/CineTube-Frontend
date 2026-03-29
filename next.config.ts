import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        // allow any https source so dev/prod poster URLs never break
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
