"use client";

import { useState, useCallback } from "react";
import MemberLogin from "./MemberLogin";
import DownloadSection from "./DownloadSection";
import WebsiteStats from "./WebsiteStats";
import { useCategories } from "@/hooks/useCategories";

interface SidebarProps {
  selectedCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

export default function Sidebar({ selectedCategory: externalSelectedCategory, onCategoryChange }: SidebarProps = {} as SidebarProps) {
  const [internalSelectedCategory, setInternalSelectedCategory] = useState("all");
  const { categories, isLoading } = useCategories();

  const selectedCategory = externalSelectedCategory ?? internalSelectedCategory;

  const handleCategoryChange = useCallback((categoryId: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    } else {
      setInternalSelectedCategory(categoryId);
    }
  }, [onCategoryChange]);

  return (
    <aside className="w-full md:w-64 bg-gradient-to-b from-white to-gray-50/40 border-r border-gray-200 p-8">
      <h2 className="text-base font-semibold text-green-800 mb-8 tracking-wide uppercase">Category</h2>
      
      {/* Category Filters */}
      <div className="space-y-1 mb-10">
        {/* All Products Option */}
        <label
          onClick={() => handleCategoryChange("all")}
          className={`flex items-center gap-3 cursor-pointer group py-2.5 px-3 -mx-3 rounded-md transition-all ${
            selectedCategory === "all"
              ? "bg-green-50/60 border-l-4 border-green-700 shadow-sm"
              : "hover:bg-gray-50 border-l-4 border-transparent"
          }`}
        >
          <span className={`text-sm font-light transition-colors flex-1 ${
            selectedCategory === "all"
              ? "text-green-800 font-medium"
              : "text-gray-600 group-hover:text-green-800"
          }`}>
            สินค้าทั้งหมด
          </span>
          {selectedCategory === "all" && (
            <div className="w-2 h-2 bg-green-700 rounded-full"></div>
          )}
        </label>

        {/* Category List */}
        {isLoading ? (
          <div className="text-sm text-gray-400 py-2">กำลังโหลด...</div>
        ) : (
          categories.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <label
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center gap-3 cursor-pointer group py-2.5 px-3 -mx-3 rounded-md transition-all ${
                  isSelected
                    ? "bg-green-50/60 border-l-4 border-green-700 shadow-sm"
                    : "hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                <span className={`text-sm font-light transition-colors flex-1 ${
                  isSelected
                    ? "text-green-800 font-medium"
                    : "text-gray-600 group-hover:text-green-800"
                }`}>
                  {category.name}
                </span>
                {isSelected && (
                  <div className="w-2 h-2 bg-green-700 rounded-full"></div>
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

