"use client";

import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";

export default function RightNavbar() {
  return (
    <nav className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="bg-white border-l border-gray-200 shadow-lg rounded-l-lg p-4 space-y-3">
        <Link
          href="/cart"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors group"
          title="ตะกร้าสินค้า"
        >
          <ShoppingCart className="w-5 h-5 flex-shrink-0" />
          <span className="whitespace-nowrap">ตะกร้าสินค้า</span>
        </Link>

        <Link
          href="/products"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors group"
          title="ค้นหาสินค้าในหน้า Products"
        >
          <Search className="w-5 h-5 flex-shrink-0" />
          <span className="whitespace-nowrap">ค้นหาสินค้า</span>
        </Link>
      </div>
    </nav>
  );
}

