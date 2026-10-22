import type { Metadata } from "next";
import { NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "โปรไฟล์",
  robots: NOINDEX_FOLLOW,
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
