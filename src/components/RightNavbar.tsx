"use client";

import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";

export default function RightNavbar() {
  const menuItems = [
    { 
      label: "ตะกร้าสินค้า", 
      href: "/cart",
      icon: ShoppingCart
    },
    { 
      label: "ติดตามคำสั่งซื้อของคุณ", 
      href: "/orders/track",
      icon: Package
    },
  ];

  return (
    <nav className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="bg-white border-l border-gray-200 shadow-lg rounded-l-lg p-4 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors group"
              title={item.label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

