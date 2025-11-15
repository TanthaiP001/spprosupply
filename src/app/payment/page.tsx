"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import { Building2, QrCode, Globe, MessageCircle, Phone, Mail, Facebook } from "lucide-react";
import Image from "next/image";

export default function PaymentPage() {

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <RightNavbar />
      
      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              วิธีการสั่งซื้อและชำระเงิน
            </h1>
          </div>

          {/* วิธีการสั่งซื้อ */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              วิธีการสั่งซื้อ
            </h2>
            <div className="space-y-4">
              {/* Website */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-700">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-1">web:</p>
                  <a
                    href="https://www.spprosupply.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    www.spprosupply.com
                  </a>
                </div>
              </div>

              {/* LINE */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-green-600">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-2">LINE:</p>
                  <div className="space-y-1">
                    <p className="text-gray-700">ID : chana2710</p>
                    <p className="text-gray-700">ID : spprosupply</p>
                  </div>
                </div>
              </div>

              {/* LINE SHOP */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-green-600">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-1">LINE SHOP:</p>
                  <p className="text-gray-700">หมวด สำนักงาน ชื่อร้าน Sp นวัตกรรม วงล้อ สื่อ ป้ายธนรงค์</p>
                </div>
              </div>

              {/* Facebook */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600">
                  <Facebook className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-1">Facebook:</p>
                  <a
                    href="https://www.facebook.com/sppro999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline block mb-1"
                  >
                    www.facebook.com/sppro999
                  </a>
                  <p className="text-gray-600 text-sm">(ส่งข้อความหรือสั่งซื้อที่รูปสินค้า)</p>
                </div>
              </div>

              {/* Phone & Fax */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-700">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-1">โทรศัพท์ & แฟ็กซ์:</p>
                  <div className="space-y-1">
                    <a
                      href="tel:0810116699"
                      className="text-gray-700 hover:text-gray-900 block"
                    >
                      081-0116699
                    </a>
                    <a
                      href="tel:0899213355"
                      className="text-gray-700 hover:text-gray-900 block"
                    >
                      089-9213355
                    </a>
                    <p className="text-gray-700">โทร&แฟ็กซ์ 035-587147</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-1">E-mail:</p>
                  <div className="space-y-1">
                    <a
                      href="mailto:spprosupply@gmail.com"
                      className="text-blue-600 hover:text-blue-800 underline block"
                    >
                      spprosupply@gmail.com
                    </a>
                    <a
                      href="mailto:spsupply9@gmail.com"
                      className="text-blue-600 hover:text-blue-800 underline block"
                    >
                      spsupply9@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Detail Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative w-full aspect-[3/4] md:aspect-[2/3]">
                <Image
                  src="/uploads/detailpay1.jpg"
                  alt="วิธีการสั่งซื้อและชำระเงิน - How to Order and Pay"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative w-full aspect-[3/4] md:aspect-[2/3]">
                <Image
                  src="/uploads/detailpay2.jpg"
                  alt="รายละเอียดวิธีการชำระเงิน - Payment Details"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            </div>
          </div>

          {/* วิธีการชำระเงิน */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              วิธีการชำระเงิน
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    ธนาคารกรุงไทย สาขาสุพรรณบุรี
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-700">
                      <span className="font-medium">ชื่อบัญชี:</span> เอสพี โปร ซัพพลาย
                    </p>
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">เลขบัญชี:</span>{" "}
                      <span className="font-mono font-semibold">7100395089</span>
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-700">
                      <span className="font-medium">ชื่อบัญชี:</span> ร้าน เอส พี ซัพพลาย
                    </p>
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">เลขบัญชี:</span>{" "}
                      <span className="font-mono font-semibold">7100414350</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <QrCode className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 leading-relaxed">
                  <span className="font-semibold">โอนเงินแล้วส่งหลักฐาน</span> ทาง Line ทาง Facebook หรือ E-mail
                </p>
                <p className="text-gray-800 leading-relaxed mt-2">
                  ถ้ายังไม่ได้แจ้งที่อยู่สำหรับจัดส่งสินค้าก็แจ้งมาพร้อมกันเลย
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

