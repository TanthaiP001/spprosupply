import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "วิธีการสั่งซื้อและชำระเงิน",
  description:
    "วิธีสั่งซื้อสินค้า SP Pro Supply ผ่านเว็บไซต์ LINE Facebook หรือโทรศัพท์ พร้อมข้อมูลบัญชีธนาคารสำหรับโอนเงินและการส่งหลักฐานการชำระเงิน",
  path: "/payment",
});

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
