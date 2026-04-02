"use client";

import { memo } from "react";
import { ShoppingCart } from "lucide-react";
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

export default memo(function ProductGrid({ productsToShow }: ProductGridProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 1);
    // Optional: Show toast notification
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
      {productsToShow.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors group"
        >
          {/* Product Image - Clickable */}
          <Link href={`/products/${product.slug || product.id}`}>
            <div className="w-full h-64 bg-gray-50 cursor-pointer p-8 border border-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                width={512}
                height={512}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Product Info */}
          <div className="p-5 flex flex-col justify-between min-h-[140px] border border-gray-100">
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
                className="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
})

