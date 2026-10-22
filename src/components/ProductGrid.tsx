"use client";

import { memo } from "react";
import ProductCard, { type ProductCardData } from "./ProductCard";

interface ProductGridProps {
  productsToShow: ProductCardData[];
  /** Compact 3-column cards below the md breakpoint. */
  denseOnMobile?: boolean;
}

export default memo(function ProductGrid({ productsToShow, denseOnMobile = false }: ProductGridProps) {
  const gridClass = denseOnMobile
    ? "grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
    : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3";
  const imageSizes = denseOnMobile
    ? "(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 33vw"
    : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <div className={gridClass}>
      {productsToShow.map((product) => (
        <ProductCard key={product.id} product={product} dense={denseOnMobile} imageSizes={imageSizes} />
      ))}
    </div>
  );
});
