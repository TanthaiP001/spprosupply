"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Sidebar from "@/components/Sidebar";
import ProductGrid from "@/components/ProductGrid";
import BannerHighlight from "@/components/BannerHighlight";
import Recommendations from "@/components/Recommendations";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import { highlightBanners } from "@/data/mockData";
import { useProducts, useHighlightProducts } from "@/hooks/useProducts";
import { useBanners } from "@/hooks/useBanners";

interface Product {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  image: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  rating: number;
  reviews: number;
  tag?: string | null;
  isHighlight: boolean;
  description?: string | null;
}

export default function Home() {
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
              <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">
                {selectedCategory === "all" ? "สินค้าขายดี" : "สินค้าในหมวดหมู่"}
              </h2>
              {(() => {
                if (isLoading) {
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                          <div className="w-full h-64 bg-gray-200 border border-gray-100" />
                          <div className="p-5 flex flex-col justify-between min-h-[140px] border border-gray-100 space-y-3">
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-full" />
                              <div className="h-4 bg-gray-200 rounded w-2/3" />
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                              <div className="h-6 bg-gray-200 rounded w-20" />
                              <div className="h-9 bg-gray-200 rounded-md w-32" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
                if (products.length === 0) {
                  const emptyMessage = selectedCategory === "all" 
                    ? "ยังไม่มีสินค้า Highlight" 
                    : "ไม่พบสินค้าในหมวดหมู่นี้";
                  return (
                    <div className="text-center py-12">
                      <p className="text-gray-400 font-light">{emptyMessage}</p>
                    </div>
                  );
                }
                return <ProductGrid productsToShow={products} />;
              })()}
            </div>

            {/* Homepage Banners Section */}
            <div className="mt-12 -mx-6 md:-mx-0">
              <div className="grid grid-cols-1 gap-4">
                <div className="relative w-full rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                  <Image
                    src="/homepage-banner/1411394429.gif"
                    alt="Homepage Banner"
                    width={1200}
                    height={400}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative w-full rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                  <Image
                    src="/homepage-banner/1622742199.gif"
                    alt="Homepage Banner"
                    width={1200}
                    height={400}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative w-full rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                  <Image
                    src="/homepage-banner/1945558495.jpg"
                    alt="Homepage Banner"
                    width={1200}
                    height={400}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative w-full rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                  <Image
                    src="/homepage-banner/210884266.gif"
                    alt="Homepage Banner"
                    width={1200}
                    height={400}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative w-full rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                  <Image
                    src="/homepage-banner/565772067.gif"
                    alt="Homepage Banner"
                    width={1200}
                    height={400}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="relative w-full rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                  <Image
                    src="/homepage-banner/597570734.jpg"
                    alt="Homepage Banner"
                    width={1200}
                    height={400}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
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
