"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import MemberLogin from "./MemberLogin";
import DownloadSection from "./DownloadSection";
import WebsiteStats from "./WebsiteStats";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SidebarProps {
  selectedCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

export default function Sidebar({ selectedCategory: externalSelectedCategory, onCategoryChange }: SidebarProps = {} as SidebarProps) {
  const [internalSelectedCategory, setInternalSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState({
    newArrival: false,
    bestSeller: false,
    onDiscount: false,
  });

  // Use external selectedCategory if provided, otherwise use internal state
  const selectedCategory = externalSelectedCategory !== undefined ? externalSelectedCategory : internalSelectedCategory;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    } else {
      setInternalSelectedCategory(categoryId);
    }
  };

  const toggleFilter = (filter: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  return (
    <aside className="w-full md:w-64 bg-gradient-to-b from-white to-green-50/20 border-r border-green-100 p-8">
      <h2 className="text-base font-light bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-8 tracking-wide uppercase font-semibold">Category</h2>
      
      {/* Category Filters */}
      <div className="space-y-1 mb-10">
        {/* All Products Option */}
        <label
          onClick={() => handleCategoryChange("all")}
          className={`flex items-center gap-3 cursor-pointer group py-2.5 px-3 -mx-3 rounded-md transition-all ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 shadow-sm"
              : "hover:bg-green-50/50 border-l-4 border-transparent"
          }`}
        >
          <span className={`text-sm font-light transition-colors flex-1 ${
            selectedCategory === "all"
              ? "text-green-700 font-medium"
              : "text-gray-600 group-hover:text-green-700"
          }`}>
            สินค้าทั้งหมด
          </span>
          {selectedCategory === "all" && (
            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-sm"></div>
          )}
        </label>

        {/* Category List */}
        {isLoading ? (
          <div className="text-sm text-gray-400 py-2">กำลังโหลด...</div>
        ) : (
          categories.map((category, index) => {
            const colors = [
              "from-green-50 to-emerald-50",
              "from-emerald-50 to-teal-50",
              "from-teal-50 to-cyan-50",
              "from-cyan-50 to-green-50",
            ];
            const borderColors = [
              "border-green-500",
              "border-emerald-500",
              "border-teal-500",
              "border-cyan-500",
            ];
            const dotColors = [
              "from-green-500 to-emerald-500",
              "from-emerald-500 to-teal-500",
              "from-teal-500 to-cyan-500",
              "from-cyan-500 to-green-500",
            ];
            const colorIndex = index % colors.length;
            const isSelected = selectedCategory === category.id;

            return (
              <label
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center gap-3 cursor-pointer group py-2.5 px-3 -mx-3 rounded-md transition-all ${
                  isSelected
                    ? `bg-gradient-to-r ${colors[colorIndex]} border-l-4 ${borderColors[colorIndex]} shadow-sm`
                    : "hover:bg-green-50/50 border-l-4 border-transparent"
                }`}
              >
                <span className={`text-sm font-light transition-colors flex-1 ${
                  isSelected
                    ? "text-green-700 font-medium"
                    : "text-gray-600 group-hover:text-green-700"
                }`}>
                  {category.name}
                </span>
                {isSelected && (
                  <div className={`w-2 h-2 bg-gradient-to-r ${dotColors[colorIndex]} rounded-full shadow-sm`}></div>
                )}
              </label>
            );
          })
        )}
      </div>

      {/* Additional Filters */}


      {/* Member Login Section */}
      <MemberLogin />

      {/* Download Section */}
      <DownloadSection />

      {/* Website Stats Section */}
      <WebsiteStats />
    </aside>
  );
}

