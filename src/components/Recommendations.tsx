"use client";

import { useRef } from "react";
import Link from "next/link";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
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
              <SwiperSlide key={product.id} className="!w-64">
                <article className="group h-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <Link
                    href={`/products/${product.slug || product.id}`}
                    className="focus-ring block"
                  >
                    <div className="flex h-48 cursor-pointer items-center justify-center bg-gray-50 p-6">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={256}
                        height={192}
                        sizes="256px"
                        loading="lazy"
                        className="hover-scale h-full w-full object-contain"
                      />
                    </div>
                  </Link>

                  <div className="flex min-h-[140px] flex-col justify-between p-5">
                    <Link
                      href={`/products/${product.slug || product.id}`}
                      className="focus-ring rounded-sm"
                    >
                      <h3 className="mb-3 line-clamp-2 text-base font-medium text-gray-900 transition-colors hover:text-green-800">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      <div className="text-xl font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(product.id, e)}
                        aria-label={`เพิ่ม ${product.name} ลงตะกร้า`}
                        className="focus-ring flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-800"
                      >
                        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                        เพิ่มลงตะกร้า
                      </button>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
