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
  images: {
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
