"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import RightNavbar from "@/components/RightNavbar";
import ProductGrid from "@/components/ProductGrid";
import CategorySidebar from "@/components/CategorySidebar";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

const Pagination = dynamic(() => import("@/components/Pagination"));
const Footer = dynamic(() => import("@/components/Footer"));

const ITEMS_PER_PAGE = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") || "";
  const searchQuery = searchParams.get("q") || "";
  const pageParam = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const { categories } = useCategories();
  const currentCategory = categoryParam
    ? categories.find((cat) => cat.slug === categoryParam || cat.id === categoryParam)
    : undefined;
  const selectedCategory = currentCategory?.id ?? "all";

  const { products, isLoading } = useProducts(
    currentCategory?.id,
    searchQuery || undefined
  );

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(pageParam, Math.max(totalPages, 1));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const buildHref = (categorySlug: string | undefined, page: number) => {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (searchQuery) params.set("q", searchQuery);
    if (page > 1) params.set("page", page.toString());
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    const params = new URLSearchParams();
    if (category) params.set("category", category.slug);
    const query = params.toString();
    router.push(query ? `/products?${query}` : "/products", { scroll: false });
  };

  const handlePageChange = (page: number) => {
    router.push(buildHref(currentCategory?.slug, page), { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            <h1 className="text-3xl md:text-5xl font-light mb-2 tracking-tight">
              {categoryName}
            </h1>
            <p className="text-base md:text-xl font-light text-white/90">
              เลือกซื้อสื่อสุขศึกษาและอุปกรณ์สาธารณสุขจาก SP Pro Supply
            </p>
          </div>
        </div>
      </div>

      {/* Main Product Area */}
      <div className="container-custom py-6 md:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          <main className="min-w-0 flex-1">
            <div className="mb-4 md:mb-8">
              <p className="text-sm font-light text-gray-500">
                {isLoading ? (
                  <span className="inline-block h-4 w-28 bg-gray-200 rounded animate-pulse align-middle" />
                ) : (
                  <>
                    พบสินค้า {products.length} รายการ
                    {searchQuery && (
                      <span className="ml-1">
                        สำหรับคำค้น &quot;{searchQuery}&quot;
                      </span>
                    )}
                    {totalPages > 1 && (
                      <span className="ml-2">
                        (หน้า {currentPage} จาก {totalPages})
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <div className="h-28 bg-gray-100 sm:h-40 md:h-64" />
                    <div className="space-y-2 p-2 sm:p-3 md:space-y-3 md:p-5">
                      <div className="h-4 w-full rounded bg-gray-200" />
                      <div className="h-4 w-2/3 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <ProductGrid productsToShow={paginatedProducts} denseOnMobile />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    hrefForPage={(page) => buildHref(currentCategory?.slug, page)}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg font-light">
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

export default function ProductsClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <Header />
          <RightNavbar />
          <div className="relative w-full h-48 md:h-64 overflow-hidden bg-gray-200 animate-pulse" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
