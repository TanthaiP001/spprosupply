"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Sidebar from "@/components/Sidebar";
import ProductGrid from "@/components/ProductGrid";
import BannerHighlight from "@/components/BannerHighlight";
import RightNavbar from "@/components/RightNavbar";

const Recommendations = dynamic(() => import("@/components/Recommendations"), {
  loading: () => (
    <div className="py-12 bg-white">
      <div className="container-custom animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-56 mb-6" />
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 rounded-lg border border-gray-100">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="flex justify-between mt-4">
                  <div className="h-6 bg-gray-200 rounded w-16" />
                  <div className="h-9 bg-gray-200 rounded w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

const Footer = dynamic(() => import("@/components/Footer"));
import { highlightBanners } from "@/data/mockData";
import { useProducts, useHighlightProducts } from "@/hooks/useProducts";
import { useBanners } from "@/hooks/useBanners";

export default function HomeClient() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Use SWR hooks for data fetching with caching
  const { products: highlightProducts, isLoading: isLoadingHighlight } = useHighlightProducts();
  const { products: categoryProducts, isLoading: isLoadingCategory } = useProducts(
    selectedCategory !== "all" ? selectedCategory : undefined
  );
  const { banners, isLoading: isLoadingBanner } = useBanners();

  // Determine which products to show and loading state
  const products = selectedCategory === "all" ? highlightProducts : categoryProducts;
  const isLoading = selectedCategory === "all" ? isLoadingHighlight : isLoadingCategory;

  // Get banner data
  const bannerHighlight = banners.length > 0
    ? {
        title: banners[0].title,
        description: banners[0].description,
        image: banners[0].image,
        link: banners[0].link,
        buttonText: banners[0].buttonText || "ดูเพิ่มเติม",
      }
    : isLoadingBanner
    ? null
    : highlightBanners[0];

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Banner />
      <RightNavbar />
      
      {/* Main Product Area */}
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Sidebar 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Main Content - Banner Highlight & Product Grid */}
          <main className="flex-1">
            {/* Banner Highlight */}
            {(() => {
              if (isLoadingBanner && !bannerHighlight) {
                return (
                  <div className="relative block w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6 bg-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300/60 via-gray-200/40 to-transparent" />
                    <div className="absolute inset-0 flex items-center p-6 md:p-10">
                      <div className="max-w-md w-full space-y-4">
                        <div className="h-8 md:h-10 bg-gray-300 rounded-md w-3/4" />
                        <div className="h-5 bg-gray-300 rounded-md w-full" />
                        <div className="h-5 bg-gray-300 rounded-md w-2/3" />
                      </div>
                    </div>
                  </div>
                );
              }
              if (bannerHighlight) {
                return (
                  <BannerHighlight
                    title={bannerHighlight.title}
                    description={bannerHighlight.description}
                    image={bannerHighlight.image}
                    link={bannerHighlight.link}
                  />
                );
              }
              return null;
            })()}

            {/* Product Highlight Section */}
            <div className="mt-8">
              <h2 className="section-heading mb-6">
                {selectedCategory === "all" ? "สินค้าขายดี" : "สินค้าในหมวดหมู่"}
              </h2>
              {(() => {
                if (isLoading) {
                  return (
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <div className="h-28 bg-gray-100 sm:h-40 md:h-64" />
                          <div className="space-y-2 p-2 sm:p-3 md:space-y-3 md:p-5">
                            <div className="h-4 w-full rounded bg-gray-200" />
                            <div className="h-4 w-2/3 rounded bg-gray-200" />
                            <div className="flex flex-col gap-2 pt-2 md:flex-row md:items-center md:justify-between">
                              <div className="h-6 w-16 rounded bg-gray-200 md:w-20" />
                              <div className="h-11 w-full rounded-md bg-gray-200 md:w-32" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
                if (products.length === 0) {
                  const emptyMessage = selectedCategory === "all"
                    ? "ยังไม่มีสินค้าแนะนำในขณะนี้"
                    : "ไม่พบสินค้าในหมวดหมู่นี้";
                  return (
                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 px-6 py-16 text-center">
                      <p className="mb-4 text-gray-600">{emptyMessage}</p>
                      <Link
                        href="/products"
                        className="focus-ring inline-flex min-h-11 items-center rounded-md bg-green-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
                      >
                        ดูสินค้าทั้งหมด
                      </Link>
                    </div>
                  );
                }
                return <ProductGrid productsToShow={products} denseOnMobile />;
              })()}
            </div>

            {/* Homepage Banners Section */}
            <div className="content-auto mt-12">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { src: "/homepage-banner/1411394429.gif", gif: true, alt: "โปรโมชั่นสินค้าสุขภาพ" },
                  { src: "/homepage-banner/1622742199.gif", gif: true, alt: "สินค้านวัตกรรมสุขภาพ" },
                  { src: "/homepage-banner/1945558495.jpg", gif: false, alt: "แบนเนอร์สินค้า SP Pro Supply" },
                  { src: "/homepage-banner/210884266.gif", gif: true, alt: "โปรโมชั่นพิเศษ" },
                  { src: "/homepage-banner/565772067.gif", gif: true, alt: "สินค้าแนะนำ" },
                  { src: "/homepage-banner/597570734.jpg", gif: false, alt: "แบนเนอร์สินค้าสุขภาพ" },
                ].map((banner) => (
                  <div key={banner.src} className="relative w-full overflow-hidden rounded-lg">
                    <Image
                      src={banner.src}
                      alt={banner.alt}
                      width={1200}
                      height={400}
                      sizes="(max-width: 768px) 100vw, 1200px"
                      loading="lazy"
                      unoptimized={banner.gif}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Recommendations Section */}
      <Recommendations />

      {/* Footer */}
      <Footer />
    </div>
  );
}
