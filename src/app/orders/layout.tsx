import type { Metadata } from "next";
import { NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ติดตามคำสั่งซื้อ",
  robots: NOINDEX_FOLLOW,
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
