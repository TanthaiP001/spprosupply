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
            {bannerHighlight && (
              <BannerHighlight
                title={bannerHighlight.title}
                description={bannerHighlight.description}
                image={bannerHighlight.image}
                link={bannerHighlight.link}
              />
            )}

            {/* Product Highlight Section */}
            <div className="mt-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
                {selectedCategory === "all" ? "สินค้าขายดี" : "สินค้าในหมวดหมู่"}
              </h2>
              {(() => {
                if (isLoading) {
                  return (
                    <div className="text-center py-12">
                      <p className="text-gray-400 font-light">กำลังโหลดข้อมูล...</p>
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
