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
  /** Compact 3-column cards below the md breakpoint. */
  denseOnMobile?: boolean;
}

const regularStyles = {
  grid: "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3",
  imageWrap: "h-64 p-8",
  imageSizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  body: "min-h-[140px] p-5",
  title: "mb-3 text-base",
  footer: "flex-row items-center justify-between gap-3",
  price: "text-xl",
  button: "px-4",
  label: "hidden sm:inline",
  shortLabel: "sm:hidden",
};

const denseStyles = {
  grid: "grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3",
  imageWrap: "h-28 p-2 sm:h-40 sm:p-4 md:h-64 md:p-8",
  imageSizes: "(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 33vw",
  body: "p-2 sm:p-3 md:min-h-[140px] md:p-5",
  title: "mb-2 text-xs leading-snug sm:text-sm md:mb-3 md:text-base",
  footer: "flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-between md:gap-3",
  price: "text-sm sm:text-base md:text-xl",
  button: "px-2 md:px-4",
  label: "hidden md:inline",
  shortLabel: "sr-only",
};

export default memo(function ProductGrid({ productsToShow, denseOnMobile = false }: ProductGridProps) {
  const s = denseOnMobile ? denseStyles : regularStyles;
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
    <div className={s.grid}>
      {productsToShow.map((product) => (
        <article
          key={product.id}
          className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300"
        >
          <Link
            href={`/products/${product.slug || product.id}`}
            className="focus-ring block"
          >
            <div className={`flex cursor-pointer items-center justify-center bg-gray-50 ${s.imageWrap}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={512}
                height={512}
                sizes={s.imageSizes}
                loading="lazy"
                className="hover-scale h-full w-full object-contain"
              />
            </div>
          </Link>

          <div className={`flex flex-1 flex-col justify-between ${s.body}`}>
            <Link
              href={`/products/${product.slug || product.id}`}
              className="focus-ring rounded-sm"
            >
              <h3 className={`line-clamp-2 font-medium text-gray-900 transition-colors hover:text-green-800 ${s.title}`}>
                {product.name}
              </h3>
            </Link>

            <div className={`mt-auto flex ${s.footer}`}>
              <div className={`font-semibold text-gray-900 ${s.price}`}>
                {formatPrice(product.price)}
              </div>
              <button
                type="button"
                onClick={(e) => handleAddToCart(product.id, e)}
                aria-label={`เพิ่ม ${product.name} ลงตะกร้า`}
                className={`focus-ring flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-green-700 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-800 ${s.button}`}
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                <span className={s.label}>เพิ่มลงตะกร้า</span>
                <span className={s.shortLabel}>เพิ่ม</span>
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
})
