"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { categoryPath } from "@/lib/paths";

interface CategorySidebarProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

// Mobile: horizontal scrolling chips. md+: vertical radio-style list.
function rowClass(checked: boolean) {
  return [
    "group flex shrink-0 cursor-pointer items-center gap-3 whitespace-nowrap transition-colors",
    "min-h-11 rounded-full border px-4",
    checked ? "border-green-700 bg-green-50" : "border-gray-200 bg-white",
    "md:min-h-0 md:-mx-1 md:rounded-md md:border-0 md:bg-transparent md:px-1 md:py-2.5 md:whitespace-normal md:hover:bg-gray-50",
  ].join(" ");
}

function labelClass(checked: boolean) {
  return `flex-1 text-sm transition-colors group-hover:text-black ${
    checked ? "font-medium text-green-800 md:font-light md:text-gray-900" : "font-light text-gray-600"
  }`;
}

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`hidden h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border md:flex ${
        checked ? "border-black" : "border-gray-300"
      }`}
    >
      {checked && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
    </span>
  );
}

export default function CategorySidebar({
  selectedCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  const { categories, isLoading } = useCategories();
  const isAll = selectedCategory === "all";

  return (
    <aside className="w-full bg-white md:w-64 md:border-r md:border-gray-100 md:p-8">
      <h2 className="mb-3 text-sm font-light tracking-wide text-gray-900 md:mb-8 md:text-base">
        หมวดหมู่สินค้า
      </h2>

      <nav
        aria-label="หมวดหมู่สินค้า"
        className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:block md:space-y-1 md:overflow-visible md:px-0 md:pb-0"
      >
        <Link
          href="/products"
          scroll={false}
          onClick={(e) => {
            e.preventDefault();
            onCategoryChange("all");
          }}
          aria-current={isAll ? "page" : undefined}
          className={rowClass(isAll)}
        >
          <RadioDot checked={isAll} />
          <span className={labelClass(isAll)}>สินค้าทั้งหมด</span>
        </Link>

        {isLoading ? (
          <div className="py-2 text-sm text-gray-400">กำลังโหลด...</div>
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
                  scroll={false}
                  onClick={(e) => {
                    e.preventDefault();
                    onCategoryChange(category.id);
                  }}
                  aria-current={isSelected ? "page" : undefined}
                  className={rowClass(isSelected)}
                >
                  <RadioDot checked={isSelected} />
                  <span className={labelClass(isSelected)}>{category.name}</span>
                </Link>
              );
            })
        )}
      </nav>
    </aside>
  );
}
