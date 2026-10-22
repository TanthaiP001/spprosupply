import type { Metadata } from "next";
import { NOINDEX_NOFOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Admin",
  robots: NOINDEX_NOFOLLOW,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
