"use client";

import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

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

interface ProductGridProps {
  productsToShow: Product[];
}

export default function ProductGrid({ productsToShow }: ProductGridProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 1);
    // Optional: Show toast notification
  };

  const formatReviews = (reviews: number) => {
    if (reviews >= 1000) {
      return `${(reviews / 1000).toFixed(1)}k`;
    }
    return reviews.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productsToShow.map((product) => (
        <div
          key={product.id}
          className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
        >
          {/* Product Image - Clickable */}
          <Link href={`/products/${product.slug || product.id}`}>
            <div className="relative w-full h-64 bg-white cursor-pointer">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Category Tag */}
              {product.tag && (
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium text-gray-700">
                  {product.tag}
                </div>
              )}
            </div>
          </Link>

          {/* Product Info */}
          <div className="p-4">
            <Link href={`/products/${product.slug || product.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-black transition-colors cursor-pointer">
                {product.name}
              </h3>
            </Link>

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
              <button
                onClick={(e) => handleAddToCart(product.id, e)}
                className="flex-1 bg-black text-white py-2 px-3 rounded hover:bg-gray-800 transition-colors text-xs font-light flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                เพิ่มลงตะกร้า
              </button>
              <Link
                href={`/products/${product.slug || product.id}`}
                className="flex-1 bg-transparent text-gray-600 py-2 px-3 rounded hover:text-black hover:bg-gray-50 transition-colors text-xs font-light text-center"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

