"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Package, Folder, Users, ArrowLeft, Shield, Image as ImageIcon, ShoppingCart, TrendingUp, Eye } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Statistics {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  ordersByStatus: Array<{ status: string; _count: { status: number } }>;
  salesByDate: Array<{ date: string; sales: number }>;
  productsByCategory: Array<{ name: string; count: number }>;
  visitorData: Array<{ date: string; visitors: number }>;
}

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login");
      return;
    }
    fetchStatistics();
  }, [isAuthenticated, isAdmin, router]);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/statistics", {
        headers: {
          "x-user-id": user?.id || "",
        },
      });
      const data = await response.json();
      if (response.ok && data.statistics) {
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const formatPrice = (price: number) => {
    return `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const menuItems = [
    {
      title: "จัดการสินค้า",
      description: "สร้าง แก้ไข และลบสินค้า",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "จัดการหมวดหมู่",
      description: "สร้าง แก้ไข และลบหมวดหมู่สินค้า",
      href: "/admin/categories",
      icon: Folder,
    },
    {
      title: "จัดการผู้ใช้",
      description: "ดูรายชื่อผู้ใช้ทั้งหมด",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "จัดการ Banner",
      description: "สร้าง แก้ไข และลบ Banner หน้าแรก",
      href: "/admin/banners",
      icon: ImageIcon,
    },
    {
      title: "จัดการคำสั่งซื้อ",
      description: "ดูและจัดการคำสั่งซื้อทั้งหมด",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <RightNavbar />

      {/* Banner */}
      <div className="border-b border-gray-100">
        <div className="container-custom py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-light text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            กลับหน้าหลัก
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-gray-400" />
            <h1 className="text-2xl font-light text-gray-900 tracking-tight">
              Admin Panel
            </h1>
          </div>
        </div>
      </div>

      <div className="container-custom py-16 space-y-12">
        {/* Statistics Cards */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-light">กำลังโหลดข้อมูล...</p>
          </div>
        ) : statistics ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Products */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-400">
                    <Package className="w-5 h-5" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-light text-gray-900 mb-1">
                  {statistics.totalProducts.toLocaleString()}
                </div>
                <div className="text-xs font-light text-gray-500">จำนวนสินค้า</div>
              </div>

              {/* Total Orders */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-400">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-light text-gray-900 mb-1">
                  {statistics.totalOrders.toLocaleString()}
                </div>
                <div className="text-xs font-light text-gray-500">จำนวนคำสั่งซื้อ</div>
              </div>

              {/* Total Sales */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-light text-gray-900 mb-1">
                  {formatPrice(statistics.totalSales)}
                </div>
                <div className="text-xs font-light text-gray-500">ยอดขายรวม</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visitor Chart */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <h3 className="text-base font-light text-gray-900">ยอดผู้เข้าชม (7 วันล่าสุด)</h3>
                </div>
                {statistics.visitorData.length > 0 && (
                  <Line
                    data={{
                      labels: statistics.visitorData.map((d) => d.date),
                      datasets: [
                        {
                          label: "ผู้เข้าชม",
                          data: statistics.visitorData.map((d) => d.visitors),
                          borderColor: "rgb(0, 0, 0)",
                          backgroundColor: "rgba(0, 0, 0, 0.05)",
                          tension: 0.4,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          padding: 12,
                          titleFont: {
                            size: 12,
                            weight: "normal",
                          },
                          bodyFont: {
                            size: 12,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "rgba(0, 0, 0, 0.05)",
                          },
                          ticks: {
                            font: {
                              size: 11,
                            },
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            font: {
                              size: 11,
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>

              {/* Sales Chart */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <h3 className="text-base font-light text-gray-900">ยอดขาย (7 วันล่าสุด)</h3>
                </div>
                {statistics.salesByDate.length > 0 && (
                  <Bar
                    data={{
                      labels: statistics.salesByDate.map((d) => d.date),
                      datasets: [
                        {
                          label: "ยอดขาย",
                          data: statistics.salesByDate.map((d) => d.sales),
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          padding: 12,
                          callbacks: {
                            label: function (context) {
                              return `ยอดขาย: ${formatPrice(context.parsed.y)}`;
                            },
                          },
                          titleFont: {
                            size: 12,
                            weight: "normal",
                          },
                          bodyFont: {
                            size: 12,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "rgba(0, 0, 0, 0.05)",
                          },
                          ticks: {
                            font: {
                              size: 11,
                            },
                            callback: function (value) {
                              return `฿${Number(value).toLocaleString()}`;
                            },
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            font: {
                              size: 11,
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>

              {/* Products by Category */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-gray-400" />
                  <h3 className="text-base font-light text-gray-900">จำนวนสินค้าตามหมวดหมู่</h3>
                </div>
                {statistics.productsByCategory.length > 0 && (
                  <Doughnut
                    data={{
                      labels: statistics.productsByCategory.map((c) => c.name),
                      datasets: [
                        {
                          data: statistics.productsByCategory.map((c) => c.count),
                          backgroundColor: [
                            "rgba(59, 130, 246, 0.8)", // blue
                            "rgba(34, 197, 94, 0.8)", // green
                            "rgba(168, 85, 247, 0.8)", // purple
                            "rgba(234, 179, 8, 0.8)", // yellow
                            "rgba(239, 68, 68, 0.8)", // red
                            "rgba(99, 102, 241, 0.8)", // indigo
                            "rgba(236, 72, 153, 0.8)", // pink
                            "rgba(14, 165, 233, 0.8)", // sky
                            "rgba(251, 146, 60, 0.8)", // orange
                            "rgba(20, 184, 166, 0.8)", // teal
                          ],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            padding: 15,
                            font: {
                              size: 11,
                            },
                            usePointStyle: true,
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          padding: 12,
                          titleFont: {
                            size: 12,
                            weight: "normal",
                          },
                          bodyFont: {
                            size: 12,
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>

              {/* Orders by Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                  <h3 className="text-base font-light text-gray-900">คำสั่งซื้อตามสถานะ</h3>
                </div>
                {statistics.ordersByStatus.length > 0 && (
                  <Doughnut
                    data={{
                      labels: statistics.ordersByStatus.map((o) => {
                        const statusMap: Record<string, string> = {
                          pending: "รอดำเนินการ",
                          confirmed: "ยืนยันแล้ว",
                          processing: "กำลังจัดเตรียม",
                          shipped: "จัดส่งแล้ว",
                          completed: "เสร็จสมบูรณ์",
                          cancelled: "ยกเลิก",
                        };
                        return statusMap[o.status] || o.status;
                      }),
                      datasets: [
                        {
                          data: statistics.ordersByStatus.map((o) => o._count.status),
                          backgroundColor: [
                            "rgba(234, 179, 8, 0.8)", // yellow - pending
                            "rgba(59, 130, 246, 0.8)", // blue - confirmed
                            "rgba(168, 85, 247, 0.8)", // purple - processing
                            "rgba(99, 102, 241, 0.8)", // indigo - shipped
                            "rgba(34, 197, 94, 0.8)", // green - completed
                            "rgba(239, 68, 68, 0.8)", // red - cancelled
                          ],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            padding: 15,
                            font: {
                              size: 11,
                            },
                            usePointStyle: true,
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          padding: 12,
                          titleFont: {
                            size: 12,
                            weight: "normal",
                          },
                          bodyFont: {
                            size: 12,
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          </>
        ) : null}

        {/* Menu Items */}
        <div>
          <h2 className="text-xl font-light text-gray-900 mb-6 tracking-tight">เมนูจัดการ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-white border border-gray-200 rounded-lg p-8 hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex flex-col gap-4">
                    <div className="text-gray-400 group-hover:text-gray-900 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-light text-gray-900 mb-1.5 group-hover:text-black transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs font-light text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

