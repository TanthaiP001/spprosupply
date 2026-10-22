import type { NextConfig } from "next";

// Legacy .php URLs are redirected in src/middleware.ts (which also drops their query strings).
const apexToWwwRedirect = {
  source: "/:path*",
  has: [{ type: "host" as const, value: "spprosupply.com" }],
  destination: "https://www.spprosupply.com/:path*",
  permanent: true,
};

const nextConfig: NextConfig = {
  redirects: async () => [apexToWwwRedirect],
  headers: async () => [
    {
      source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/_next/static/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/fonts/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    // Reduce the number of resized variants Next/Vercel has to generate.
    // Keep this set aligned with the app's actual display widths (catalog + banners).
    deviceSizes: [320, 420, 640, 768, 1024, 1280],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 768, 1024, 1280],
    // Prefer long-lived caching for optimized images so Vercel doesn't re-transform
    // the same original URL/width combinations.
    minimumCacheTTL: 15552000, // 180 days (in seconds)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
