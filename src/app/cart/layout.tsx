import type { Metadata } from "next";
import { NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ตะกร้าสินค้า",
  robots: NOINDEX_FOLLOW,
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
