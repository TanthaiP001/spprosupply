"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, MapPin, LogOut, Save, ArrowLeft, Shield } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, updateProfile, isAuthenticated, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    province: "",
    postalCode: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        district: user.district || "",
        province: user.province || "",
        postalCode: user.postalCode || "",
      });
    }
  }, [user, isAuthenticated, router]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    await updateProfile(formData);
    
    setMessage("บันทึกข้อมูลสำเร็จ");
    setIsEditing(false);
    setIsSaving(false);

    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated || !user) {
    return null;
  }

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
            โปรไฟล์
          </h1>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white border border-gray-100 rounded-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-light text-gray-900">
                      {user.firstName} {user.lastName}
                    </h2>
                    {isAdmin && (
                      <span className="px-2 py-1 text-xs font-light bg-blue-50 text-blue-600 border border-blue-200 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-light text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-light text-white bg-black hover:bg-gray-900 transition-colors border border-black"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-light text-gray-600 hover:text-red-600 transition-colors border border-gray-200 hover:border-red-200"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ
                </button>
              </div>
            </div>

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded text-sm font-light mb-4">
                {message}
              </div>
            )}
          </div>

          {/* Profile Form */}
          <div className="bg-white border border-gray-100 rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light text-gray-900 uppercase tracking-wider">
                ข้อมูลส่วนตัว
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-light text-gray-600 hover:text-black transition-colors"
                >
                  แก้ไข
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                    ชื่อ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                    />
                  ) : (
                    <p className="text-sm font-light text-gray-900 py-2.5">
                      {formData.firstName || "-"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                    นามสกุล
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                    />
                  ) : (
                    <p className="text-sm font-light text-gray-900 py-2.5">
                      {formData.lastName || "-"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                  อีเมล
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-light text-gray-900 py-2.5">
                    {formData.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                  เบอร์โทรศัพท์
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-light text-gray-900 py-2.5">
                      {formData.phone || "-"}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="text-sm font-light text-gray-900 mb-4 uppercase tracking-wider">
                  ที่อยู่สำหรับจัดส่ง
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                      ที่อยู่
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white resize-none"
                      />
                    ) : (
                      <p className="text-sm font-light text-gray-900 py-2.5">
                        {formData.address || "-"}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                        อำเภอ/เขต
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.district}
                          onChange={(e) =>
                            setFormData({ ...formData, district: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                        />
                      ) : (
                        <p className="text-sm font-light text-gray-900 py-2.5">
                          {formData.district || "-"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                        จังหวัด
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.province}
                          onChange={(e) =>
                            setFormData({ ...formData, province: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                        />
                      ) : (
                        <p className="text-sm font-light text-gray-900 py-2.5">
                          {formData.province || "-"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
                        รหัสไปรษณีย์
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) =>
                            setFormData({ ...formData, postalCode: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
                        />
                      ) : (
                        <p className="text-sm font-light text-gray-900 py-2.5">
                          {formData.postalCode || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-black text-white py-3 px-4 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-light flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data
                      if (user) {
                        setFormData({
                          firstName: user.firstName || "",
                          lastName: user.lastName || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          address: user.address || "",
                          district: user.district || "",
                          province: user.province || "",
                          postalCode: user.postalCode || "",
                        });
                      }
                    }}
                    className="flex-1 bg-white text-gray-900 py-3 px-4 hover:bg-gray-50 transition-colors text-sm font-light border border-gray-200"
                  >
                    ยกเลิก
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

