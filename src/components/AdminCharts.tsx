"use client";

import { memo } from "react";
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
import { Eye, TrendingUp, Package, ShoppingCart } from "lucide-react";

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

const chartTooltip = {
  backgroundColor: "rgba(0, 0, 0, 0.8)" as const,
  padding: 12,
  titleFont: { size: 12, weight: "normal" as const },
  bodyFont: { size: 12 },
};

const axisFont = { size: 11 };

export default memo(function AdminCharts({ statistics, formatPrice }: { statistics: Statistics; formatPrice: (n: number) => string }) {
  return (
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
              datasets: [{
                label: "ผู้เข้าชม",
                data: statistics.visitorData.map((d) => d.visitors),
                borderColor: "rgb(0, 0, 0)",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                tension: 0.4,
                fill: true,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: { legend: { display: false }, tooltip: chartTooltip },
              scales: {
                y: { beginAtZero: true, grid: { color: "rgba(0, 0, 0, 0.05)" }, ticks: { font: axisFont } },
                x: { grid: { display: false }, ticks: { font: axisFont } },
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
              datasets: [{
                label: "ยอดขาย",
                data: statistics.salesByDate.map((d) => d.sales),
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                borderRadius: 4,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  ...chartTooltip,
                  callbacks: { label: (ctx) => `ยอดขาย: ${formatPrice(ctx.parsed.y ?? 0)}` },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: "rgba(0, 0, 0, 0.05)" },
                  ticks: { font: axisFont, callback: (v) => `฿${Number(v).toLocaleString()}` },
                },
                x: { grid: { display: false }, ticks: { font: axisFont } },
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
              datasets: [{
                data: statistics.productsByCategory.map((c) => c.count),
                backgroundColor: [
                  "rgba(59, 130, 246, 0.8)",
                  "rgba(34, 197, 94, 0.8)",
                  "rgba(168, 85, 247, 0.8)",
                  "rgba(234, 179, 8, 0.8)",
                  "rgba(239, 68, 68, 0.8)",
                  "rgba(99, 102, 241, 0.8)",
                  "rgba(236, 72, 153, 0.8)",
                  "rgba(14, 165, 233, 0.8)",
                  "rgba(251, 146, 60, 0.8)",
                  "rgba(20, 184, 166, 0.8)",
                ],
                borderWidth: 0,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { position: "bottom", labels: { padding: 15, font: axisFont, usePointStyle: true } },
                tooltip: chartTooltip,
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
              datasets: [{
                data: statistics.ordersByStatus.map((o) => o._count.status),
                backgroundColor: [
                  "rgba(234, 179, 8, 0.8)",
                  "rgba(59, 130, 246, 0.8)",
                  "rgba(168, 85, 247, 0.8)",
                  "rgba(99, 102, 241, 0.8)",
                  "rgba(34, 197, 94, 0.8)",
                  "rgba(239, 68, 68, 0.8)",
                ],
                borderWidth: 0,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { position: "bottom", labels: { padding: 15, font: axisFont, usePointStyle: true } },
                tooltip: chartTooltip,
              },
            }}
          />
        )}
      </div>
    </div>
  );
})
