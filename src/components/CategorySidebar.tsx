"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { categoryPath } from "@/lib/paths";

interface CategorySidebarProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const rowClass =
  "flex items-center gap-3 cursor-pointer group py-2.5 px-1 -mx-1 rounded-md hover:bg-gray-50 transition-colors";

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
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

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-100 p-8">
      <h2 className="text-base font-light text-gray-900 mb-8 tracking-wide">
        หมวดหมู่สินค้า
      </h2>

      <nav aria-label="หมวดหมู่สินค้า" className="space-y-1">
        <Link
          href="/products"
          scroll={false}
          onClick={(e) => {
            e.preventDefault();
            onCategoryChange("all");
          }}
          aria-current={selectedCategory === "all" ? "page" : undefined}
          className={rowClass}
        >
          <RadioDot checked={selectedCategory === "all"} />
          <span className="text-sm font-light text-gray-600 group-hover:text-black transition-colors flex-1">
            สินค้าทั้งหมด
          </span>
        </Link>

        {isLoading ? (
          <div className="text-sm text-gray-400 py-2">กำลังโหลด...</div>
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
                  className={rowClass}
                >
                  <RadioDot checked={isSelected} />
                  <span className="text-sm font-light text-gray-600 group-hover:text-black transition-colors flex-1">
                    {category.name}
                  </span>
                </Link>
              );
            })
        )}
      </nav>
    </aside>
  );
}
