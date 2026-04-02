import type { NextConfig } from "next";

/**
 * SEO-friendly 301 redirects for legacy PHP URLs (static mappings).
 * Dynamic redirects (e.g. product-detail.php?id=25 → /products/25) are
 * handled in src/middleware.ts. Unknown .php URLs also redirect to /
 * in middleware.
 */
const phpRedirects = [
  { source: "/index.php", destination: "/", permanent: true },
  { source: "/contactme.php", destination: "/contact", permanent: true },
  { source: "/aboutus.php", destination: "/about", permanent: true },
  { source: "/products.php", destination: "/products", permanent: true },
  { source: "/news.php", destination: "/news", permanent: true },
  { source: "/product-detail.php", destination: "/products", permanent: true },
  { source: "/category.php", destination: "/category", permanent: true },
];

const nextConfig: NextConfig = {
  redirects: async () => phpRedirects,
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
