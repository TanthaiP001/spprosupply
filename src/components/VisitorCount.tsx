"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";

export default function VisitorCount() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();
        
        if (response.ok) {
          setVisitorCount(data.visitors || 0);
        }
      } catch (error) {
        console.error("Error fetching visitor count:", error);
        setVisitorCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitorCount();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchVisitorCount, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Users className="w-4 h-4" />
        <span>กำลังโหลด...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Users className="w-4 h-4" />
      <span>
        ผู้เข้าชม: <span className="font-semibold text-gray-900">{visitorCount?.toLocaleString() || 0}</span>
      </span>
    </div>
  );
}

