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

  const categoryButtonClass = (isSelected: boolean) =>
    `flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors focus-ring ${
      isSelected
        ? "bg-green-50 ring-1 ring-green-700/25 shadow-sm"
        : "hover:bg-gray-50"
    }`;

  const categoryLabelClass = (isSelected: boolean) =>
    `flex-1 text-sm transition-colors ${
      isSelected
        ? "font-medium text-green-800"
        : "font-normal text-gray-600 hover:text-green-800"
    }`;

  return (
    <aside className="w-full md:w-64 border-r border-gray-200 bg-gradient-to-b from-white to-gray-50/40 p-6 md:p-8">
      <h2 className="mb-6 text-sm font-semibold tracking-wide text-green-800">
        หมวดหมู่
      </h2>

      <nav aria-label="หมวดหมู่สินค้า" className="mb-10 space-y-1">
        <button
          type="button"
          onClick={() => handleCategoryChange("all")}
          aria-current={selectedCategory === "all" ? "true" : undefined}
          className={categoryButtonClass(selectedCategory === "all")}
        >
          <span className={categoryLabelClass(selectedCategory === "all")}>
            สินค้าทั้งหมด
          </span>
          {selectedCategory === "all" && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-green-700" aria-hidden="true" />
          )}
        </button>

        {isLoading ? (
          <div className="space-y-2 py-2" aria-busy="true" aria-label="กำลังโหลดหมวดหมู่">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-md bg-gray-100" />
            ))}
          </div>
        ) : (
          categories
            .slice()
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((category) => {
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  aria-current={isSelected ? "true" : undefined}
                  className={categoryButtonClass(isSelected)}
                >
                  <span className={categoryLabelClass(isSelected)}>
                    {category.name}
                  </span>
                  {isSelected && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-green-700" aria-hidden="true" />
                  )}
                </button>
              );
            })
        )}
      </nav>

      <MemberLogin />
      <DownloadSection />
      <WebsiteStats />
    </aside>
  );
}
