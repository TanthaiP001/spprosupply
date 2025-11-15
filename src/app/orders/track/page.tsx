"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import { Search, Package, CheckCircle, XCircle, Truck, Clock, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
  note: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentSlip: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any; description: string }> = {
  pending: {
    label: "รอดำเนินการ",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    description: "คำสั่งซื้อของคุณได้รับการรับแล้ว กำลังรอการตรวจสอบสลิปการโอนเงิน",
  },
  confirmed: {
    label: "ยืนยันแล้ว",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
    description: "การชำระเงินได้รับการยืนยันแล้ว กำลังเตรียมจัดส่งสินค้า",
  },
  processing: {
    label: "กำลังจัดเตรียม",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Package,
    description: "สินค้ากำลังถูกจัดเตรียมและบรรจุภัณฑ์",
  },
  shipped: {
    label: "จัดส่งแล้ว",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: Truck,
    description: "สินค้าถูกจัดส่งแล้ว กำลังอยู่ระหว่างการขนส่ง",
  },
  completed: {
    label: "เสร็จสมบูรณ์",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    description: "คำสั่งซื้อเสร็จสมบูรณ์ ขอบคุณที่ใช้บริการ",
  },
  cancelled: {
    label: "ยกเลิก",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    description: "คำสั่งซื้อนี้ถูกยกเลิก",
  },
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError("กรุณาระบุหมายเลขคำสั่งซื้อ");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        setError(data.error || "ไม่พบคำสั่งซื้อ");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      setError("เกิดข้อผิดพลาดในการค้นหา");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <RightNavbar />

      {/* Banner */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container-custom py-8">
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
            ติดตามสถานะคำสั่งซื้อ
          </h1>
          <p className="text-gray-600 mt-2">ตรวจสอบสถานะคำสั่งซื้อของคุณด้วยหมายเลขคำสั่งซื้อ</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          {/* Search Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมายเลขคำสั่งซื้อ
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="เช่น ORD-1234567890-ABC123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  {isLoading ? "กำลังค้นหา..." : "ค้นหา"}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Order Status Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {order.orderNumber}
                    </h2>
                    <p className="text-sm text-gray-600">
                      วันที่สั่งซื้อ: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  {(() => {
                    const statusInfo = statusConfig[order.status] || statusConfig.pending;
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div
                        className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-5 h-5" />
                        <span className="font-medium">{statusInfo.label}</span>
                      </div>
                    );
                  })()}
                </div>

                {(() => {
                  const statusInfo = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">{statusInfo.description}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Customer Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  ข้อมูลการจัดส่ง
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ชื่อ-นามสกุล</p>
                    <p className="font-medium text-gray-900">
                      {order.firstName} {order.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      เบอร์โทรศัพท์
                    </p>
                    <p className="font-medium text-gray-900">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      อีเมล
                    </p>
                    <p className="font-medium text-gray-900">{order.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">ที่อยู่</p>
                    <p className="font-medium text-gray-900">
                      {order.address} {order.district} {order.province} {order.postalCode}
                    </p>
                  </div>
                  {order.note && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">หมายเหตุ</p>
                      <p className="font-medium text-gray-900">{order.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">รายการสินค้า</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-md"
                    >
                      <div className="relative w-20 h-20 bg-white rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          จำนวน: {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">สรุปการสั่งซื้อ</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ยอดรวมสินค้า</span>
                    <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ค่าจัดส่ง</span>
                    <span className="font-medium text-gray-900">
                      {order.shippingFee === 0 ? (
                        <span className="text-green-600">ฟรี</span>
                      ) : (
                        formatPrice(order.shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">ยอดรวมทั้งสิ้น</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Slip */}
              {order.paymentSlip && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">สลิปการโอนเงิน</h3>
                  <Link href={order.paymentSlip} target="_blank" className="inline-block">
                    <div className="relative w-full max-w-md border border-gray-200 rounded-md overflow-hidden">
                      <Image
                        src={order.paymentSlip}
                        alt="Payment slip"
                        width={600}
                        height={800}
                        className="object-contain w-full"
                      />
                    </div>
                  </Link>
                </div>
              )}

              {/* Help Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ต้องการความช่วยเหลือ?</h3>
                <p className="text-sm text-gray-700 mb-4">
                  หากมีคำถามเกี่ยวกับคำสั่งซื้อของคุณ กรุณาติดต่อเรา
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact-us"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    ติดต่อเรา
                  </Link>
                  <Link
                    href="/payment"
                    className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
                  >
                    วิธีการชำระเงิน
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!order && !error && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">วิธีค้นหาคำสั่งซื้อ</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>กรุณาระบุหมายเลขคำสั่งซื้อที่ได้รับหลังจากสั่งซื้อสำเร็จ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>หมายเลขคำสั่งซื้อจะมีรูปแบบเช่น ORD-1234567890-ABC123</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>หากไม่พบคำสั่งซื้อ กรุณาตรวจสอบหมายเลขอีกครั้งหรือติดต่อเรา</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

