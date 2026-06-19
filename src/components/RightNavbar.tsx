"use client";

import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";

export default function RightNavbar() {
  return (
    <nav
      aria-label="ทางลัด"
      className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="space-y-2 rounded-l-lg border-l border-gray-200 bg-white p-3 shadow-lg">
        <Link
          href="/cart"
          className="focus-ring group flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-green-800"
        >
          <ShoppingCart className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">ตะกร้าสินค้า</span>
        </Link>

        <Link
          href="/products"
          className="focus-ring group flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-green-800"
        >
          <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">ค้นหาสินค้า</span>
        </Link>
      </div>
    </nav>
  );
}
