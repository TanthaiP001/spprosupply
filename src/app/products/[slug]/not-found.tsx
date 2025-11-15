import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <RightNavbar />
      <div className="container-custom py-12">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-4">ไม่พบสินค้า</h1>
          <p className="text-gray-600 mb-8">ขออภัย ไม่พบสินค้าที่คุณกำลังมองหา</p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors text-sm font-light"
          >
            กลับไปยังสินค้าทั้งหมด
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

