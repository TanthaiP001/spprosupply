"use client";

import Link from "next/link";
import { ShoppingCart, Search, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  
  const menuItems = [
    { label: "หน้าแรก", href: "/" },
    { label: "สินค้า", href: "/products" },
    { label: "ตะกร้าสินค้า", href: "/cart" },
    { label: "ติดตามคำสั่งซื้อ", href: "/orders/track" },
    { label: "วิธีการชำระเงิน", href: "/payment" },
    { label: "ติดต่อเรา", href: "/contact-us" },
    ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <div className="text-2xl font-bold text-black">Spprosupply</div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-black transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/cart"
              className="p-2 text-gray-700 hover:text-black transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>
            <Link
              href={isAuthenticated ? "/profile" : "/login"}
              className="p-2 text-gray-700 hover:text-black transition-colors"
              title={isAuthenticated ? user?.email : "เข้าสู่ระบบ"}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

