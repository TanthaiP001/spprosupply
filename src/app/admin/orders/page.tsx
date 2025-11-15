"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { Package, Eye, CheckCircle, XCircle, Truck, Clock, X, ChevronDown, ChevronUp, Calendar } from "lucide-react";
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

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "รอดำเนินการ", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "ยืนยันแล้ว", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  processing: { label: "กำลังจัดเตรียม", color: "bg-purple-100 text-purple-800", icon: Package },
  shipped: { label: "จัดส่งแล้ว", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  completed: { label: "เสร็จสมบูรณ์", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "ยกเลิก", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [isAuthenticated, isAdmin, router, selectedStatus, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== "all") {
        params.append("status", selectedStatus);
      }
      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }
      
      const url = params.toString() ? `/api/orders?${params.toString()}` : "/api/orders";
      const response = await fetch(url, {
        headers: {
          "x-user-id": user?.id || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };


  const formatPrice = (price: number) => {
    return `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <RightNavbar />

      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการคำสั่งซื้อ</h1>
          <p className="text-gray-600">ดูและจัดการคำสั่งซื้อทั้งหมด</p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedStatus === "all"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ทั้งหมด
            </button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">กรองตามวันที่:</span>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">ตั้งแต่</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">ถึง</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || undefined}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={clearDateFilter}
                  className="px-4 py-2 mt-6 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  ล้าง
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">กำลังโหลด...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">ไม่พบคำสั่งซื้อ</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      เลขที่คำสั่งซื้อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ลูกค้า
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่สั่งซื้อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ยอดรวม
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => {
                    const statusInfo = statusConfig[order.status] || statusConfig.pending;
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.firstName} {order.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{order.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatShortDate(order.createdAt)}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString("th-TH", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(order.total)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusInfo.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="text-gray-600 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-md"
                              title="ดูรายละเอียด"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {order.status !== "completed" && order.status !== "cancelled" && (
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
                              >
                                <option value="pending">รอดำเนินการ</option>
                                <option value="confirmed">ยืนยันแล้ว</option>
                                <option value="processing">กำลังจัดเตรียม</option>
                                <option value="shipped">จัดส่งแล้ว</option>
                                <option value="completed">เสร็จสมบูรณ์</option>
                                <option value="cancelled">ยกเลิก</option>
                              </select>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-light text-gray-900">
                  รายละเอียดคำสั่งซื้อ: {selectedOrder.orderNumber}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  วันที่สั่งซื้อ: {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    ข้อมูลลูกค้า
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">ชื่อ-นามสกุล:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {selectedOrder.firstName} {selectedOrder.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">โทรศัพท์:</span>{" "}
                      <span className="font-medium text-gray-900">{selectedOrder.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">อีเมล:</span>{" "}
                      <span className="font-medium text-gray-900">{selectedOrder.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ที่อยู่:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {selectedOrder.address} {selectedOrder.district} {selectedOrder.province}{" "}
                        {selectedOrder.postalCode}
                      </span>
                    </div>
                    {selectedOrder.note && (
                      <div>
                        <span className="text-gray-600">หมายเหตุ:</span>{" "}
                        <span className="font-medium text-gray-900">{selectedOrder.note}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Status */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">สถานะคำสั่งซื้อ</h4>
                  <div className="mb-4">
                    {(() => {
                      const statusInfo = statusConfig[selectedOrder.status] || statusConfig.pending;
                      const StatusIcon = statusInfo.icon;
                      return (
                        <div
                          className={`px-4 py-3 rounded-lg border flex items-center gap-2 ${statusInfo.color} border-current`}
                        >
                          <StatusIcon className="w-5 h-5" />
                          <span className="font-medium">{statusInfo.label}</span>
                        </div>
                      );
                    })()}
                  </div>
                  {selectedOrder.status !== "completed" && selectedOrder.status !== "cancelled" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        เปลี่ยนสถานะ:
                      </label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => {
                          updateOrderStatus(selectedOrder.id, e.target.value);
                          setSelectedOrder({ ...selectedOrder, status: e.target.value });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="pending">รอดำเนินการ</option>
                        <option value="confirmed">ยืนยันแล้ว</option>
                        <option value="processing">กำลังจัดเตรียม</option>
                        <option value="shipped">จัดส่งแล้ว</option>
                        <option value="completed">เสร็จสมบูรณ์</option>
                        <option value="cancelled">ยกเลิก</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">รายการสินค้า</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
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
                          จำนวน: {item.quantity} x {formatPrice(item.price)} ={" "}
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Slip */}
              {selectedOrder.paymentSlip && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">สลิปการโอนเงิน</h4>
                  <Link
                    href={selectedOrder.paymentSlip}
                    target="_blank"
                    className="inline-block"
                  >
                    <div className="relative w-full max-w-md border border-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={selectedOrder.paymentSlip}
                        alt="Payment slip"
                        width={600}
                        height={800}
                        className="object-contain w-full"
                      />
                    </div>
                  </Link>
                </div>
              )}

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">สรุปการสั่งซื้อ</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ยอดรวมสินค้า:</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(selectedOrder.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ค่าจัดส่ง:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.shippingFee === 0 ? (
                        <span className="text-green-600">ฟรี</span>
                      ) : (
                        formatPrice(selectedOrder.shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t border-gray-200">
                    <span>ยอดรวมทั้งสิ้น:</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
