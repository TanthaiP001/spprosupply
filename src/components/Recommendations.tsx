"use client";

import { useState, useRef, useEffect } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useRecommendedProducts } from "@/hooks/useProducts";

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

export default function Recommendations() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { addToCart } = useCart();
  
  // Use SWR hook for recommendations with caching
  const { products: recommendedProducts, isLoading } = useRecommendedProducts();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Check scroll after products load
    if (recommendedProducts.length > 0) {
      const timer = setTimeout(() => {
        checkScroll();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [recommendedProducts]);

  const formatPrice = (price: number) => {
    return `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 1);
  };

  return (
    <div className="py-12 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            สินค้าแนะนำจากทางร้าน
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 border border-green-200 rounded-md hover:bg-green-50 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-green-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 border border-green-200 rounded-md hover:bg-green-50 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-green-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Product List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-light">กำลังโหลดข้อมูล...</p>
          </div>
        ) : recommendedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-light">ยังไม่มีสินค้าแนะนำ</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          >
            {recommendedProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow group border border-gray-100"
            >
              {/* Product Image */}
              <Link href={`/products/${product.slug || product.id}`}>
                <div className="relative w-full h-48 bg-gray-50 cursor-pointer p-6">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-5 flex flex-col justify-between min-h-[140px]">
                <Link href={`/products/${product.slug || product.id}`}>
                  <h3 className="text-base font-medium text-gray-900 mb-3 hover:text-gray-700 transition-colors cursor-pointer line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xl font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(product.id, e)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-emerald-600 transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    เพิ่มลงตะกร้า
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

