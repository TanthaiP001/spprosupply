"use client";

import { Users, Eye, TrendingUp } from "lucide-react";

export default function WebsiteStats() {
  // Mock data - ในแอปจริงจะดึงจาก API หรือ database
  const stats = {
    totalVisitors: 12580,
    todayVisitors: 342,
    onlineNow: 28,
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="border-t border-gray-100 pt-8 mt-8">
      <h3 className="text-base font-light text-gray-900 mb-6 tracking-wide uppercase">สถิติการเข้าชม</h3>
      
      <div className="space-y-3">
        {/* Total Visitors */}
        <div className="flex items-center gap-3.5 p-3 border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="flex-shrink-0 w-9 h-9 bg-gray-50 flex items-center justify-center border border-gray-100">
            <Eye className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-light text-gray-400 mb-1">ผู้เข้าชมทั้งหมด</div>
            <div className="text-base font-light text-gray-900">
              {formatNumber(stats.totalVisitors)}
            </div>
          </div>
        </div>

        {/* Today Visitors */}
        <div className="flex items-center gap-3.5 p-3 border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="flex-shrink-0 w-9 h-9 bg-gray-50 flex items-center justify-center border border-gray-100">
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-light text-gray-400 mb-1">ผู้เข้าชมวันนี้</div>
            <div className="text-base font-light text-gray-900">
              {formatNumber(stats.todayVisitors)}
            </div>
          </div>
        </div>

        {/* Online Now */}
        <div className="flex items-center gap-3.5 p-3 border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="flex-shrink-0 w-9 h-9 bg-gray-50 flex items-center justify-center border border-gray-100">
            <Users className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-light text-gray-400 mb-1">กำลังออนไลน์</div>
            <div className="text-base font-light text-gray-900">
              {stats.onlineNow}
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

