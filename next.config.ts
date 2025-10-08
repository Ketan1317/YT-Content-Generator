import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Old 'domains' field is deprecated, remove it
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
