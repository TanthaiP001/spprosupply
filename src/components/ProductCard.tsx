"use client";

import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { productPath } from "@/lib/paths";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  image: string;
  tag?: string | null;
  category?: { name: string } | null;
}

interface ProductCardProps {
  product: ProductCardData;
  /** Compact layout below the md breakpoint (used in 3-column mobile grids). */
  dense?: boolean;
  imageSizes?: string;
}

const ADDED_FEEDBACK_MS = 1600;

const regular = {
  media: "aspect-[5/4] p-6",
  body: "gap-1.5 p-4",
  category: "text-xs",
  title: "text-base",
  footer: "flex-row items-end justify-between gap-3 pt-3",
  price: "text-xl",
  button: "px-4",
  label: "inline",
  tag: "left-3 top-3 px-2.5 py-1 text-xs",
};

const dense = {
  media: "aspect-square p-2 sm:p-4 md:aspect-[5/4] md:p-6",
  body: "gap-1 p-2 sm:p-3 md:gap-1.5 md:p-4",
  category: "hidden md:block md:text-xs",
  title: "text-xs leading-snug sm:text-sm md:text-base",
  footer: "flex-col items-stretch gap-2 pt-2 md:flex-row md:items-end md:justify-between md:gap-3 md:pt-3",
  price: "text-sm sm:text-base md:text-xl",
  button: "px-2 md:px-4",
  label: "hidden md:inline",
  tag: "left-1.5 top-1.5 px-1.5 py-0.5 text-[10px] md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-xs",
};

function formatPrice(price: number) {
  return price.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default memo(function ProductCard({
  product,
  dense: isDense = false,
  imageSizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const s = isDense ? dense : regular;
  const href = productPath(product);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    setJustAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-green-900/10 bg-white transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-green-700/30 hover:shadow-[0_14px_30px_-16px_rgba(20,83,45,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative">
        <div className={`flex items-center justify-center bg-white ${s.media}`}>
          <Image
            src={product.image}
            alt={product.name}
            width={512}
            height={512}
            sizes={imageSizes}
            loading="lazy"
            className="hover-scale h-full w-full object-contain"
          />
        </div>
        {product.tag && (
          <span
            className={`absolute rounded-full bg-green-700 font-semibold leading-none text-white ${s.tag}`}
          >
            {product.tag}
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col border-t border-green-900/5 bg-gradient-to-b from-green-50/50 to-white ${s.body}`}>
        {product.category?.name && (
          <p className={`line-clamp-1 font-medium text-green-800 ${s.category}`}>
            {product.category.name}
          </p>
        )}

        <h3 className={`line-clamp-2 font-medium text-gray-900 ${s.title}`}>
          <Link
            href={href}
            className="focus-ring rounded-sm transition-colors hover:text-green-800 after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>

        <div className={`mt-auto flex ${s.footer}`}>
          <p className={`font-bold tabular-nums tracking-tight text-green-900 ${s.price}`}>
            <span className="mr-0.5 text-[0.7em] font-semibold">฿</span>
            {formatPrice(product.price)}
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={justAdded ? `เพิ่ม ${product.name} ลงตะกร้าแล้ว` : `เพิ่ม ${product.name} ลงตะกร้า`}
            className={`focus-ring relative z-10 flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 active:scale-[0.97] motion-reduce:active:scale-100 ${s.button} ${
              justAdded ? "bg-green-900" : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {justAdded ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            )}
            <span className={s.label} aria-live="polite">
              {justAdded ? "เพิ่มแล้ว" : "เพิ่มลงตะกร้า"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
});
