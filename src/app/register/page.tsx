"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { User, Lock, Mail, Phone, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      if (success) {
        router.push("/profile");
      } else {
        setError("อีเมลนี้ถูกใช้งานแล้ว");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <RightNavbar />

      {/* Banner */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container-custom py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-light text-gray-600 hover:text-black transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับหน้าหลัก
          </Link>
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
            สมัครสมาชิก
          </h1>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-gray-100 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm font-light">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                    ชื่อ
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="ชื่อ"
                    className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                    นามสกุล
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="นามสกุล"
                    className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                  อีเมล
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                  เบอร์โทรศัพท์
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="081-234-5678"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                  ยืนยันรหัสผ่าน
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    placeholder="ยืนยันรหัสผ่าน"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 px-4 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-light border border-black"
              >
                {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </button>

              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm font-light text-gray-500 mb-4">
                  มีบัญชีอยู่แล้ว?
                </p>
                <Link
                  href="/login"
                  className="inline-block w-full bg-white text-gray-900 py-3 px-4 hover:bg-gray-50 transition-colors text-sm font-light border border-gray-200 text-center"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

