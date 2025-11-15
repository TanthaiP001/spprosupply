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
    <aside className="w-full md:w-64 bg-white border-r border-gray-100 p-8">
      <h2 className="text-base font-light text-gray-900 mb-8 tracking-wide uppercase">Category</h2>
      
      {/* Category Filters */}
      <div className="space-y-1 mb-10">
        {/* All Products Option */}
        <label
          className="flex items-center gap-3 cursor-pointer group py-2.5 px-1 -mx-1 rounded-md hover:bg-gray-50 transition-colors"
        >
          <input
            type="radio"
            name="category"
            value="all"
            checked={selectedCategory === "all"}
            onChange={() => handleCategoryChange("all")}
            className="w-3.5 h-3.5 text-black border-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-sm font-light text-gray-600 group-hover:text-black transition-colors flex-1">
            สินค้าทั้งหมด
          </span>
          {selectedCategory === "all" && (
            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
          )}
        </label>

        {/* Category List */}
        {isLoading ? (
          <div className="text-sm text-gray-400 py-2">กำลังโหลด...</div>
        ) : (
          categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer group py-2.5 px-1 -mx-1 rounded-md hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategory === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="w-3.5 h-3.5 text-black border-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm font-light text-gray-600 group-hover:text-black transition-colors flex-1">
                {category.name}
              </span>
              {selectedCategory === category.id && (
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
              )}
            </label>
          ))
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

