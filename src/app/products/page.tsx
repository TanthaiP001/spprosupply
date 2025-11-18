"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import ProductGrid from "@/components/ProductGrid";
import CategorySidebar from "@/components/CategorySidebar";
import Pagination from "@/components/Pagination";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ITEMS_PER_PAGE = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") || "all";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [currentPage, setCurrentPage] = useState(pageParam);

  // Use SWR hooks for data fetching with caching
  const { products, isLoading } = useProducts(
    selectedCategory !== "all" ? selectedCategory : undefined
  );
  const { categories } = useCategories();

  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setCurrentPage(1);
  }, [categoryParam]);

  // Sync page with URL
  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (categoryId !== "all") {
      params.set("category", categoryId);
    }
    // Reset to page 1 when category changes
    params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`, { scroll: false });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get category name
  const currentCategory = categories.find((cat) => cat.id === selectedCategory);
  const categoryName = currentCategory?.name || "สินค้าทั้งหมด";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <RightNavbar />

      {/* Banner Section */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden bg-gray-50">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920)",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 container-custom h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-light mb-2 tracking-tight">
              สินค้าทั้งหมด
            </h1>
            <p className="text-lg md:text-xl font-light text-white/90">
              เลือกซื้อสินค้าคุณภาพจากเรา
            </p>
          </div>
        </div>
      </div>

      {/* Main Product Area */}
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar - Category */}
          <div className="w-full md:w-64 flex-shrink-0">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Main Content - Product Grid */}
          <main className="flex-1">
            {/* Page Header */}
            <div className="mb-8">
              {selectedCategory !== "all" && (
                <p className="text-sm font-light text-gray-500 mb-2 uppercase tracking-wider">
                  หมวดหมู่: {categoryName}
                </p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-sm font-light text-gray-400">
                  {isLoading ? (
                    "กำลังโหลด..."
                  ) : (
                    <>
                      พบสินค้า {products.length} รายการ
                      {totalPages > 1 && (
                        <span className="ml-2">
                          (หน้า {currentPage} จาก {totalPages})
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg font-light">กำลังโหลดข้อมูล...</p>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <ProductGrid productsToShow={paginatedProducts} />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg font-light">
                  ไม่พบสินค้าในหมวดหมู่นี้
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <Header />
          <RightNavbar />
          <div className="container-custom py-12">
            <div className="text-center">
              <p className="text-gray-400 font-light">กำลังโหลด...</p>
            </div>
          </div>
          <Footer />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

