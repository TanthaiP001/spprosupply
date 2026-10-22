"use client";

import Link from "next/link";
import { FACEBOOK_URL } from "@/lib/site";

const linkClass = "focus-ring rounded-sm text-sm text-white/90 transition-colors hover:text-white";

const shopLinks = [
  { href: "/products", label: "สินค้าทั้งหมด" },
  { href: "/payment", label: "วิธีสั่งซื้อและชำระเงิน" },
  { href: "/orders/track", label: "ติดตามคำสั่งซื้อ" },
];

const supportLinks = [
  { href: "/contact", label: "ติดต่อเรา" },
  { href: "/cart", label: "ตะกร้าสินค้า" },
];

export default function Footer() {
  return (
    <footer className="border-t border-green-700/30 bg-gradient-to-br from-green-900 via-green-800 to-green-900 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">ช้อปปิ้ง</h3>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">ช่วยเหลือ</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <h3 className="mb-4 text-sm font-semibold text-white">ติดตามเรา</h3>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex min-h-11 min-w-11 items-center justify-center rounded-md text-white/90 transition-colors hover:text-white"
              aria-label="Facebook SP Pro Supply"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
