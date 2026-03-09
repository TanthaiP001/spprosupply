"use client";

import { useRef } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useRecommendedProducts } from "@/hooks/useProducts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";

const SLIDES_LIMIT = 12;

export default function Recommendations() {
  const swiperRef = useRef<SwiperType | null>(null);
  const { addToCart } = useCart();
  const { products: recommendedProducts, isLoading } = useRecommendedProducts();

  const displayProducts = recommendedProducts.slice(0, SLIDES_LIMIT);

  const formatPrice = (price: number) =>
    `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 1);
  };

  return (
    <div className="py-12 bg-white content-auto">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-800">
            สินค้าแนะนำจากทางร้าน
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
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
          <div className="text-center py-12">
            <p className="text-gray-400 font-light">ยังไม่มีสินค้าแนะนำ</p>
          </div>
        ) : (
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            modules={[Navigation, FreeMode]}
            freeMode={{ enabled: true, sticky: true }}
            spaceBetween={24}
            slidesPerView="auto"
            grabCursor
            className="!overflow-visible"
          >
            {displayProducts.map((product) => (
              <SwiperSlide key={product.id} className="!w-64">
                <div className="bg-white rounded-lg overflow-hidden group border border-gray-100 h-full">
                  <Link href={`/products/${product.slug || product.id}`}>
                    <div className="relative w-full h-48 bg-gray-50 cursor-pointer p-6">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="256px"
                        loading="lazy"
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col justify-between min-h-[140px]">
                    <Link href={`/products/${product.slug || product.id}`}>
                      <h3 className="text-base font-medium text-gray-900 mb-3 hover:text-gray-700 transition-colors cursor-pointer line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-xl font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        className="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        เพิ่มลงตะกร้า
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
