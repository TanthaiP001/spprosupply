"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Check, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { categoryPath, productPath } from "@/lib/paths";

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  image: string;
  images: string[];
  category: ProductCategory;
  tag?: string | null;
  description?: string | null;
}

interface ProductDetailClientProps {
  product: ProductDetail;
  relatedProducts: ProductDetail[];
}

const formatPrice = (price: number) =>
  `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addToCart(product.id, 1);

    setShowAddedMessage(true);
    setTimeout(() => {
      setShowAddedMessage(false);
    }, 2000);

    setIsAddingToCart(false);
  };

  const handleBuyNow = () => {
    addToCart(product.id, 1);
    router.push("/cart");
  };

  const category = product.category;
  const productImages = (product.images.length > 0 ? product.images : [product.image])
    .filter((u) => typeof u === "string" && u.trim().length > 0)
    .slice(0, 3);

  return (
    <div className="container-custom py-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-light text-gray-600 hover:text-black transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        กลับไปยังสินค้าทั้งหมด
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="w-full">
          <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={productImages[activeImageIndex]}
              alt={activeImageIndex === 0 ? product.name : `${product.name} - รูปที่ ${activeImageIndex + 1}`}
              width={1200}
              height={1200}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="w-full h-full object-cover"
            />
            {product.tag && (
              <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded text-xs font-medium text-gray-700 border border-gray-200">
                {product.tag}
              </div>
            )}
          </div>

          {productImages.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {productImages.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`shrink-0 rounded-lg overflow-hidden border ${
                    idx === activeImageIndex
                      ? "border-green-800"
                      : "border-gray-200 hover:border-gray-300"
                  } bg-gray-50`}
                  aria-label={`เลือกภาพที่ ${idx + 1}`}
                >
                  <div className="relative w-20 h-20">
                    <Image
                      src={src}
                      alt={`${product.name} - รูปที่ ${idx + 1}`}
                      width={160}
                      height={160}
                      sizes="80px"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-tight">
              {product.name}
            </h1>

            {category && (
              <div className="mb-4">
                <Link
                  href={categoryPath(category)}
                  className="text-sm font-light text-gray-500 hover:text-black transition-colors"
                >
                  หมวดหมู่: {category.name}
                </Link>
              </div>
            )}

            <div className="text-4xl font-light text-gray-900 mb-6 tracking-tight">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-light text-gray-900 mb-3 uppercase tracking-wider">
              คำอธิบายสินค้า
            </h2>
            <p className="text-sm font-light text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description || `${product.name} เป็นสินค้าคุณภาพสูงที่ออกแบบมาเพื่อตอบสนองความต้องการของคุณ ด้วยคุณสมบัติที่โดดเด่นและราคาที่เหมาะสม ทำให้เป็นตัวเลือกที่ดีสำหรับการใช้งานในชีวิตประจำวัน`}
            </p>
          </div>

          {/* Features */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-light text-gray-900 mb-4 uppercase tracking-wider">
              คุณสมบัติ
            </h2>
            <ul className="space-y-2">
              {[
                "คุณภาพสูง ใช้งานได้นาน",
                "ออกแบบทันสมัย สวยงาม",
                "ใช้งานง่าย สะดวก",
                "รับประกันคุณภาพ",
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm font-light text-gray-600">
                  <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-100 relative">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 bg-black text-white py-4 px-6 hover:bg-gray-900 transition-colors text-sm font-light flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              {isAddingToCart ? "กำลังเพิ่ม..." : "เพิ่มลงตะกร้า"}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-white text-black py-4 px-6 hover:bg-gray-50 transition-colors text-sm font-light border border-gray-300"
            >
              ซื้อเลย
            </button>

            {showAddedMessage && (
              <div className="absolute -top-12 left-0 right-0 bg-green-700 text-white py-2 px-4 rounded-md text-sm font-light flex items-center justify-center gap-2 transition-all duration-300 opacity-100">
                <Check className="w-4 h-4" />
                เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-light text-gray-900 mb-1 uppercase tracking-wider">
                  รับประกัน
                </div>
                <div className="text-xs font-light text-gray-500">6 เดือน</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-light text-gray-900 mb-1 uppercase tracking-wider">
                  คืนสินค้า
                </div>
                <div className="text-xs font-light text-gray-500">ภายใน 30 วัน</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-100 pt-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-tight">
            สินค้าที่เกี่ยวข้อง
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow group border border-gray-100"
              >
                <Link href={productPath(relatedProduct)}>
                  <div className="w-full h-48 bg-gray-50 cursor-pointer p-6">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      width={512}
                      height={256}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-5 flex flex-col justify-between min-h-[100px]">
                  <Link href={productPath(relatedProduct)}>
                    <h3 className="text-base font-medium text-gray-900 mb-3 hover:text-gray-700 transition-colors cursor-pointer line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  <div className="text-xl font-semibold text-gray-900 mt-auto">
                    {formatPrice(relatedProduct.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
