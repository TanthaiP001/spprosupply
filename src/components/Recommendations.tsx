"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useRecommendedProducts } from "@/hooks/useProducts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";

const SLIDES_LIMIT = 12;

export default function Recommendations() {
  const swiperRef = useRef<SwiperType | null>(null);
  const { products: recommendedProducts, isLoading } = useRecommendedProducts();

  const displayProducts = recommendedProducts.slice(0, SLIDES_LIMIT);

  return (
    <section aria-labelledby="recommendations-heading" className="content-auto bg-white py-12">
      <div className="container-custom">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id="recommendations-heading" className="section-heading">
            สินค้าแนะนำจากทางร้าน
          </h2>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              className="focus-ring flex min-h-11 min-w-11 items-center justify-center rounded-md border border-gray-300 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="เลื่อนไปซ้าย"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              className="focus-ring flex min-h-11 min-w-11 items-center justify-center rounded-md border border-gray-300 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="เลื่อนไปขวา"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" aria-hidden="true" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 rounded-lg border border-gray-100 animate-pulse">
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
        ) : displayProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 px-6 py-16 text-center">
            <p className="mb-4 text-gray-600">ยังไม่มีสินค้าแนะนำในขณะนี้</p>
            <Link
              href="/products"
              className="focus-ring inline-flex min-h-11 items-center rounded-md bg-green-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
            >
              ดูสินค้าทั้งหมด
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden">
            <Swiper
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
              modules={[Navigation, FreeMode]}
              freeMode={{ enabled: true, sticky: true }}
              spaceBetween={24}
              slidesPerView="auto"
              grabCursor
              className="!overflow-hidden"
            >
            {displayProducts.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto !w-64 py-1">
                <ProductCard product={product} imageSizes="256px" />
              </SwiperSlide>
            ))}
          </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
