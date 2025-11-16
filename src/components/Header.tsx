"use client";

import Link from "next/link";
import Image from "next/image";
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
    <header className="sticky top-0 z-50 w-full border-b border-green-200/50 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 shadow-md">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-lg p-2">
              <Image
                src="/logo/logo.png"
                alt="Spprosupply Logo"
                width={40}
                height={40}
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="text-2xl font-bold text-white drop-shadow-sm">
              Spprosupply
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-white/90 hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/cart"
              className="p-2 text-white/90 hover:text-white transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-white text-green-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>
            <Link
              href={isAuthenticated ? "/profile" : "/login"}
              className="p-2 text-white/90 hover:text-white transition-colors"
              title={isAuthenticated ? user?.email : "เข้าสู่ระบบ"}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white/30 transition-all">
                <User className="h-4 w-4 text-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

