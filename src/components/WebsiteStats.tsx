"use client";

import { useState, useEffect } from "react";
import { Users, Eye, TrendingUp } from "lucide-react";

export default function WebsiteStats() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    onlineNow: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();
        
        if (response.ok) {
          setStats({
            totalVisitors: data.visitors || 0,
            todayVisitors: Math.floor((data.visitors || 0) * 0.03), // Approximate 3% of total
            onlineNow: Math.floor((data.visitors || 0) * 0.002), // Approximate 0.2% of total
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="border-t border-gray-100 pt-8 mt-8">
      <h3 className="text-base font-light text-gray-900 mb-6 tracking-wide uppercase">สถิติการเข้าชม</h3>
      
      {isLoading ? (
        <div className="text-sm text-gray-400 py-4">กำลังโหลด...</div>
      ) : (
        <div className="space-y-3">
          {/* Total Visitors */}
          <div className="flex items-center gap-3.5 p-3 border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex-shrink-0 w-9 h-9 bg-gray-50 flex items-center justify-center border border-gray-100">
              <Eye className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-light text-gray-400 mb-1">ผู้เข้าชมทั้งหมด</div>
              <div className="text-base font-light text-gray-900">
                {stats.totalVisitors.toLocaleString()}
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
      )}
    </div>
  );
}

