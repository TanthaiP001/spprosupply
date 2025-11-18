"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import { useCart } from "@/contexts/CartContext";
import ProductStructuredData from "@/components/ProductStructuredData";
import { Star, ShoppingCart, ArrowLeft, Check, Truck, Shield, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spprosupply.com';

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

interface RelatedProduct {
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

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();

        if (response.ok && data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const formatPrice = (price: number) => {
    return `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    addToCart(product.id, 1);
    
    // Show success message
    setShowAddedMessage(true);
    setTimeout(() => {
      setShowAddedMessage(false);
    }, 2000);
    
    setIsAddingToCart(false);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    addToCart(product.id, 1);
    router.push("/cart");
  };

  const formatReviews = (reviews: number) => {
    if (reviews >= 1000) {
      return `${(reviews / 1000).toFixed(1)}k`;
    }
    return reviews.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <RightNavbar />
        <div className="container-custom py-12">
          <div className="text-center">
            <p className="text-gray-400 font-light">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const category = product.category;

  return (
    <div className="min-h-screen bg-white">
      {product && (
        <ProductStructuredData product={product} siteUrl={siteUrl} />
      )}
      <Header />
      <RightNavbar />

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm font-light text-gray-600">
            <Link href="/" className="hover:text-black transition-colors">
              หน้าแรก
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-black transition-colors">
              สินค้า
            </Link>
            {category && (
              <>
                <span>/</span>
                <Link
                  href={`/products?category=${category.id}`}
                  className="hover:text-black transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-light text-gray-600 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปยังสินค้าทั้งหมด
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.tag && (
              <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded text-xs font-medium text-gray-700 border border-gray-200">
                {product.tag}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-light text-gray-900">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm font-light text-gray-500">
                  ({formatReviews(product.reviews)} Reviews)
                </span>
                {category && (
                  <>
                    <span className="text-gray-300">|</span>
                    <Link
                      href={`/products?category=${category.id}`}
                      className="text-sm font-light text-gray-500 hover:text-black transition-colors"
                    >
                      {category.name}
                    </Link>
                  </>
                )}
              </div>

              {/* Price */}
              <div className="text-4xl font-light text-gray-900 mb-6 tracking-tight">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-light text-gray-900 mb-3 uppercase tracking-wider">
                คำอธิบายสินค้า
              </h3>
              <p className="text-sm font-light text-gray-600 leading-relaxed">
                {product.description || `${product.name} เป็นสินค้าคุณภาพสูงที่ออกแบบมาเพื่อตอบสนองความต้องการของคุณ ด้วยคุณสมบัติที่โดดเด่นและราคาที่เหมาะสม ทำให้เป็นตัวเลือกที่ดีสำหรับการใช้งานในชีวิตประจำวัน`}
              </p>
            </div>

            {/* Features */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-light text-gray-900 mb-4 uppercase tracking-wider">
                คุณสมบัติ
              </h3>
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
              
              {/* Success Message */}
              {showAddedMessage && (
                <div className="absolute -top-12 left-0 right-0 bg-green-500 text-white py-2 px-4 rounded-md text-sm font-light flex items-center justify-center gap-2 transition-all duration-300 opacity-100">
                  <Check className="w-4 h-4" />
                  เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-light text-gray-900 mb-1 uppercase tracking-wider">
                    จัดส่งฟรี
                  </div>
                  <div className="text-xs font-light text-gray-500">
                    สำหรับคำสั่งซื้อมากกว่า $50
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-light text-gray-900 mb-1 uppercase tracking-wider">
                    รับประกัน
                  </div>
                  <div className="text-xs font-light text-gray-500">1 ปี</div>
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
          <div className="border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-tight">
              สินค้าที่เกี่ยวข้อง
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow group border border-gray-100"
                >
                  <Link href={`/products/${relatedProduct.slug || relatedProduct.id}`}>
                    <div className="relative w-full h-48 bg-gray-50 cursor-pointer p-6">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col justify-between min-h-[100px]">
                    <Link href={`/products/${relatedProduct.slug || relatedProduct.id}`}>
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
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}


