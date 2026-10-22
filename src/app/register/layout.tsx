import type { Metadata } from "next";
import { NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "สมัครสมาชิก",
  robots: NOINDEX_FOLLOW,
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
