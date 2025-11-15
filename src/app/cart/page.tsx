"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Minus, Plus, Trash2, Upload, X, Check, Copy, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
    district: user?.district || "",
    province: user?.province || "",
    postalCode: user?.postalCode || "",
    note: "",
  });
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [paymentSlipPreview, setPaymentSlipPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyToClipboard = async (text: string, accountId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAccount(accountId);
      setTimeout(() => {
        setCopiedAccount(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("ไม่สามารถคัดลอกได้ กรุณาคัดลอกด้วยตนเอง");
    }
  };

  // Fetch products for cart items
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productIds = cartItems.map((item) => item.productId);
        
        if (productIds.length === 0) {
          setIsLoading(false);
          return;
        }

        // Fetch all products and filter
        const response = await fetch("/api/products");
        const data = await response.json();
        if (response.ok) {
          const allProducts = data.products || [];
          const cartProducts = allProducts.filter((p: Product) =>
            productIds.includes(p.id)
          );
          setProducts(cartProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [cartItems]);

  // Get full product details with quantities
  const getCartProducts = () => {
    return cartItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter(Boolean) as Array<Product & { quantity: number }>;
  };

  const cartProducts = getCartProducts();

  const formatPrice = (price: number) => {
    return `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const subtotal = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shippingFee;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ไฟล์ขนาดเกิน 5MB");
        return;
      }
      setPaymentSlip(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePaymentSlip = () => {
    setPaymentSlip(null);
    setPaymentSlipPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("province", formData.province);
      formDataToSend.append("postalCode", formData.postalCode);
      if (formData.note) {
        formDataToSend.append("note", formData.note);
      }
      
      // Add order totals
      formDataToSend.append("subtotal", subtotal.toString());
      formDataToSend.append("shippingFee", shippingFee.toString());
      formDataToSend.append("total", total.toString());
      
      // Add items
      const items = cartProducts.map((item) => ({
        productId: item.id,
        productName: item.name,
        productImage: item.image,
        price: item.price,
        quantity: item.quantity,
      }));
      formDataToSend.append("items", JSON.stringify(items));
      
      // Add user ID if logged in
      if (user?.id) {
        formDataToSend.append("userId", user.id);
      }
      
      // Add payment slip
      if (paymentSlip) {
        formDataToSend.append("paymentSlip", paymentSlip);
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert(`สั่งซื้อสำเร็จ! หมายเลขคำสั่งซื้อ: ${data.order.orderNumber}`);
        clearCart();
        router.push("/");
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการสั่งซื้อ");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <RightNavbar />
        <div className="container-custom py-24">
          <div className="text-center">
            <p className="text-gray-400 font-light">กำลังโหลด...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <RightNavbar />
        <div className="container-custom py-24">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-light text-gray-900 mb-4">ตะกร้าสินค้าว่าง</h1>
            <p className="text-sm font-light text-gray-500 mb-8">
              ยังไม่มีสินค้าในตะกร้าของคุณ
            </p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors text-sm font-light"
            >
              ไปเลือกซื้อสินค้า
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <RightNavbar />

      {/* Banner */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container-custom py-8">
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
            ตะกร้าสินค้า
          </h1>
        </div>
      </div>

      <div className="container-custom py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items & Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cart Items */}
              <div className="bg-white border border-gray-100 rounded-lg p-6">
                <h2 className="text-lg font-light text-gray-900 mb-6 uppercase tracking-wider">
                  สินค้าในตะกร้า ({cartProducts.length})
                </h2>
                <div className="space-y-6">
                  {cartProducts.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.slug || item.id}`}
                        className="relative w-full md:w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug || item.id}`}
                          className="text-base font-light text-gray-900 hover:text-black transition-colors mb-2 block"
                        >
                          {item.name}
                        </Link>
                        <div className="text-lg font-light text-gray-900 mb-4">
                          {formatPrice(item.price)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="px-4 py-2 text-sm font-light text-gray-900 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="ml-auto text-base font-light text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information Form */}
              <div className="bg-white border border-gray-100 rounded-lg p-6">
                <h2 className="text-lg font-light text-gray-900 mb-6 uppercase tracking-wider">
                  ข้อมูลการจัดส่ง
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                      ชื่อ *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                      placeholder="ชื่อ"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                      นามสกุล *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                      placeholder="นามสกุล"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                      เบอร์โทรศัพท์ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                      placeholder="081-234-5678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                      อีเมล *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                      ที่อยู่ *
                    </label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light resize-none"
                      placeholder="ที่อยู่"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                      อำเภอ/เขต *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                      placeholder="อำเภอ/เขต"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                      จังหวัด *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.province}
                      onChange={(e) =>
                        setFormData({ ...formData, province: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                      placeholder="จังหวัด"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                      รหัสไปรษณีย์ *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                      placeholder="10110"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                      หมายเหตุ (ถ้ามี)
                    </label>
                    <textarea
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light resize-none"
                      placeholder="หมายเหตุเพิ่มเติม"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Slip Upload */}
              <div className="bg-white border border-gray-100 rounded-lg p-6">
                <h2 className="text-lg font-light text-gray-900 mb-6 uppercase tracking-wider">
                  อัพโหลดสลิปการโอนเงิน *
                </h2>
                {!paymentSlipPreview ? (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:border-gray-300 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-light text-gray-600 mb-2">
                        คลิกเพื่ออัพโหลดสลิปการโอนเงิน
                      </p>
                      <p className="text-xs font-light text-gray-400">
                        รองรับไฟล์ JPG, PNG, PDF (ขนาดไม่เกิน 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      required
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                      {paymentSlipPreview && paymentSlip?.type.startsWith("image/") && (
                        <img
                          src={paymentSlipPreview}
                          alt="Payment slip preview"
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-light text-gray-900 truncate">
                          {paymentSlip?.name}
                        </p>
                        <p className="text-xs font-light text-gray-400">
                          {((paymentSlip?.size || 0) / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removePaymentSlip}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bank Account Information */}
              <div className="bg-white border border-gray-100 rounded-lg p-6">
                <h2 className="text-lg font-light text-gray-900 mb-6 uppercase tracking-wider">
                  ข้อมูลบัญชีธนาคาร
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <h3 className="text-base font-light text-gray-900">
                      ธนาคารกรุงไทย สาขาสุพรรณบุรี
                    </h3>
                  </div>
                  
                  {/* Account 1 */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-light text-gray-600 mb-1">ชื่อบัญชี</p>
                        <p className="text-base font-light text-gray-900 mb-3">
                          เอสพี โปร ซัพพลาย
                        </p>
                        <p className="text-sm font-light text-gray-600 mb-1">เลขบัญชี</p>
                        <p className="text-lg font-mono font-semibold text-gray-900">
                          7100395089
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("7100395089", "account1")}
                        className="flex-shrink-0 px-4 py-2 bg-black text-white text-sm font-light rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        {copiedAccount === "account1" ? (
                          <>
                            <Check className="w-4 h-4" />
                            คัดลอกแล้ว
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            คัดลอก
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Account 2 */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-light text-gray-600 mb-1">ชื่อบัญชี</p>
                        <p className="text-base font-light text-gray-900 mb-3">
                          ร้าน เอส พี ซัพพลาย
                        </p>
                        <p className="text-sm font-light text-gray-600 mb-1">เลขบัญชี</p>
                        <p className="text-lg font-mono font-semibold text-gray-900">
                          7100414350
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("7100414350", "account2")}
                        className="flex-shrink-0 px-4 py-2 bg-black text-white text-sm font-light rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        {copiedAccount === "account2" ? (
                          <>
                            <Check className="w-4 h-4" />
                            คัดลอกแล้ว
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            คัดลอก
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-lg p-6 sticky top-24">
                <h2 className="text-lg font-light text-gray-900 mb-6 uppercase tracking-wider">
                  สรุปการสั่งซื้อ
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm font-light text-gray-600">
                    <span>ยอดรวมสินค้า</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-light text-gray-600">
                    <span>ค่าจัดส่ง</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600">ฟรี</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>
                  {subtotal < 1000 && (
                    <p className="text-xs font-light text-gray-400">
                      ซื้อเพิ่มอีก {formatPrice(1000 - subtotal)} เพื่อรับการจัดส่งฟรี
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-base font-light text-gray-900">
                      <span>ยอดรวมทั้งสิ้น</span>
                      <span className="text-lg">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 px-6 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-light flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      กำลังดำเนินการ...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      ยืนยันการสั่งซื้อ
                    </>
                  )}
                </button>
                <p className="text-xs font-light text-gray-400 text-center mt-4">
                  การสั่งซื้อของคุณจะได้รับการยืนยันหลังจากตรวจสอบสลิปการโอนเงินแล้ว
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
