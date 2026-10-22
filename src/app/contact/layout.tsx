import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ติดต่อเรา",
  description:
    "ติดต่อ SP Pro Supply ร้านสื่อสุขศึกษาและอุปกรณ์สาธารณสุข จังหวัดสุพรรณบุรี สอบถามสินค้าและสั่งซื้อได้ทางโทรศัพท์ LINE Facebook และอีเมล",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
