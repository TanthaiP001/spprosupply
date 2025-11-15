"use client";

import { useState, useRef, useEffect } from "react";
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

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
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/products/recommendations");
        const data = await response.json();
        if (response.ok) {
          setRecommendedProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

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
    return `$${price.toFixed(2)}`;
  };

  const formatReviews = (reviews: number) => {
    if (reviews >= 1000) {
      return `${(reviews / 1000).toFixed(1)}k`;
    }
    return reviews.toString();
  };

  return (
    <div className="py-12 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Explore our recommendations.
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
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
              className="flex-shrink-0 w-64 bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="relative w-full h-48 bg-white">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.tag && (
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium text-gray-700">
                    {product.tag}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium text-gray-900">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({formatReviews(product.reviews)} Reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  {formatPrice(product.price)}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button className="flex-1 bg-black text-white py-2 px-3 rounded hover:bg-gray-800 transition-colors text-xs font-light flex items-center justify-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-transparent text-gray-600 py-2 px-3 rounded hover:text-black hover:bg-gray-50 transition-colors text-xs font-light">
                    Buy Now
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

