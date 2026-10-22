"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import MemberLogin from "./MemberLogin";
import DownloadSection from "./DownloadSection";
import WebsiteStats from "./WebsiteStats";
import { useCategories } from "@/hooks/useCategories";
import { categoryPath } from "@/lib/paths";

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

  // Mobile: horizontal scrolling chips. md+: vertical list.
  const categoryButtonClass = (isSelected: boolean) =>
    `focus-ring flex shrink-0 items-center gap-3 whitespace-nowrap transition-colors min-h-11 rounded-full border px-4 md:min-h-0 md:w-full md:whitespace-normal md:rounded-md md:border-0 md:px-3 md:py-2.5 md:text-left ${
      isSelected
        ? "border-green-700 bg-green-50 md:ring-1 md:ring-green-700/25 md:shadow-sm"
        : "border-gray-200 bg-white md:bg-transparent md:hover:bg-gray-50"
    }`;

  const categoryLabelClass = (isSelected: boolean) =>
    `flex-1 text-sm transition-colors ${
      isSelected
        ? "font-medium text-green-800"
        : "font-normal text-gray-600 hover:text-green-800"
    }`;

  const selectedDot = (
    <span className="hidden h-2 w-2 shrink-0 rounded-full bg-green-700 md:block" aria-hidden="true" />
  );

  return (
    <aside className="w-full md:w-64 md:border-r md:border-gray-200 md:bg-gradient-to-b md:from-white md:to-gray-50/40 md:p-8">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-green-800 md:mb-6">
        หมวดหมู่
      </h2>

      <nav
        aria-label="หมวดหมู่สินค้า"
        className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:mb-10 md:block md:space-y-1 md:overflow-visible md:px-0 md:pb-0"
      >
        <Link
          href="/products"
          onClick={(e) => {
            e.preventDefault();
            handleCategoryChange("all");
          }}
          aria-current={selectedCategory === "all" ? "true" : undefined}
          className={categoryButtonClass(selectedCategory === "all")}
        >
          <span className={categoryLabelClass(selectedCategory === "all")}>
            สินค้าทั้งหมด
          </span>
          {selectedCategory === "all" && selectedDot}
        </Link>

        {isLoading ? (
          <div className="flex gap-2 md:block md:space-y-2 md:py-2" aria-busy="true" aria-label="กำลังโหลดหมวดหมู่">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-11 w-24 shrink-0 animate-pulse rounded-full bg-gray-100 md:h-10 md:w-auto md:rounded-md" />
            ))}
          </div>
        ) : (
          categories
            .slice()
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((category) => {
              const isSelected = selectedCategory === category.id;

              return (
                <Link
                  key={category.id}
                  href={categoryPath(category)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange(category.id);
                  }}
                  aria-current={isSelected ? "true" : undefined}
                  className={categoryButtonClass(isSelected)}
                >
                  <span className={categoryLabelClass(isSelected)}>
                    {category.name}
                  </span>
                  {isSelected && selectedDot}
                </Link>
              );
            })
        )}
      </nav>

      <div className="hidden md:block">
        <MemberLogin />
        <DownloadSection />
        <WebsiteStats />
      </div>
    </aside>
  );
}
