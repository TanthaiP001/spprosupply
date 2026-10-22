import type { Metadata } from "next";
import { NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
  robots: NOINDEX_FOLLOW,
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
