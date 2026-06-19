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
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {productsToShow.map((product) => (
        <article
          key={product.id}
          className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300"
        >
          <Link
            href={`/products/${product.slug || product.id}`}
            className="focus-ring block"
          >
            <div className="flex h-64 cursor-pointer items-center justify-center bg-gray-50 p-8">
              <Image
                src={product.image}
                alt={product.name}
                width={512}
                height={512}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                className="focus-ring flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-800"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">เพิ่มลงตะกร้า</span>
                <span className="sm:hidden">เพิ่ม</span>
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
})
