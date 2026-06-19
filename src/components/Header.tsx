"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  
  const menuItems = [
    { label: "หน้าแรก", href: "/" },
    { label: "สินค้า", href: "/products" },
    { label: "ตะกร้าสินค้า", href: "/cart" },
    { label: "ติดตามคำสั่งซื้อ", href: "/orders/track" },
    { label: "วิธีการชำระเงิน", href: "/payment" },
    { label: "ติดต่อเรา", href: "/contact" },
    ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-900/20 bg-gradient-to-r from-green-800 via-green-700 to-green-800 shadow-md">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="focus-ring group flex items-center space-x-3 rounded-md">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white p-0">
              <Image
                src="/logo/logo.png"
                alt="Spprosupply Logo"
                width={55}
                height={55}
                className="hover-scale object-contain"
                priority
              />
            </div>
            <div className="text-2xl font-bold text-white drop-shadow-sm">
              Spprosupply
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden items-center space-x-6 md:flex" aria-label="เมนูหลัก">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring group relative rounded-sm text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-white transition-transform duration-200 group-hover:scale-x-100 motion-reduce:transition-none" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/products"
              className="focus-ring flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-white/90 transition-colors hover:text-white"
              aria-label="ค้นหาสินค้า"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              className="focus-ring relative flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-white/90 transition-colors hover:text-white"
              aria-label="ตะกร้าสินค้า"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-white text-green-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>
            <Link
              href={isAuthenticated ? "/profile" : "/login"}
              className="focus-ring flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-white/90 transition-colors hover:text-white"
              aria-label={isAuthenticated ? "โปรไฟล์" : "เข้าสู่ระบบ"}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 shadow-md transition-colors hover:bg-white/30">
                <User className="h-4 w-4 text-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

