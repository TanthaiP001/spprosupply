"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, User as UserIcon, Search, X, Eye, Mail, Phone, MapPin, Calendar } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login");
      return;
    }
    fetchUsers();
  }, [isAuthenticated, isAdmin, router]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users");
      const data = await response.json();

      if (response.ok) {
        const usersData = data.users || [];
        setUsers(usersData);
        setFilteredUsers(usersData);
      } else {
        setError(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const phone = user.phone.toLowerCase();
      
      return (
        fullName.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query)
      );
    });

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated || !isAdmin) {
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
            จัดการผู้ใช้
          </h1>
        </div>
      </div>

      <div className="container-custom py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-light">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm font-light">
            {error}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-lg font-light text-gray-900 uppercase tracking-wider">
                  รายชื่อผู้ใช้ทั้งหมด
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-light text-gray-500">
                    ทั้งหมด {filteredUsers.length} จาก {users.length} คน
                  </span>
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white w-64"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-light">
                  {searchQuery ? "ไม่พบข้อมูลที่ค้นหา" : "ยังไม่มีข้อมูลผู้ใช้"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        ชื่อ-นามสกุล
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        อีเมล
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        เบอร์โทร
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        ที่อยู่
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        วันที่สมัคร
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        จัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-light text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-light text-gray-600">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-light text-gray-600">
                            {user.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-light text-gray-600 max-w-xs truncate">
                            {user.address ? (
                              <>
                                {user.address}
                                {user.district && `, ${user.district}`}
                                {user.province && `, ${user.province}`}
                                {user.postalCode && ` ${user.postalCode}`}
                              </>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-light text-gray-500">
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="text-sm font-light text-gray-600 hover:text-black transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            ดูรายละเอียด
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-light text-gray-900">
                รายละเอียดผู้ใช้
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Avatar & Basic Info */}
              <div className="flex items-start gap-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-10 h-10 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light text-gray-900 mb-2">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-sm font-light text-gray-500">
                    ID: {selectedUser.id}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-light text-gray-900 uppercase tracking-wider mb-4">
                  ข้อมูลติดต่อ
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-light text-gray-500 mb-1 uppercase tracking-wider">
                        อีเมล
                      </div>
                      <div className="text-sm font-light text-gray-900">
                        {selectedUser.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-light text-gray-500 mb-1 uppercase tracking-wider">
                        เบอร์โทรศัพท์
                      </div>
                      <div className="text-sm font-light text-gray-900">
                        {selectedUser.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-light text-gray-900 uppercase tracking-wider mb-4">
                  ที่อยู่สำหรับจัดส่ง
                </h4>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    {selectedUser.address ? (
                      <div className="text-sm font-light text-gray-900 space-y-1">
                        <div>{selectedUser.address}</div>
                        {selectedUser.district && (
                          <div>อำเภอ/เขต: {selectedUser.district}</div>
                        )}
                        {selectedUser.province && (
                          <div>จังหวัด: {selectedUser.province}</div>
                        )}
                        {selectedUser.postalCode && (
                          <div>รหัสไปรษณีย์: {selectedUser.postalCode}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm font-light text-gray-400">
                        ยังไม่ได้กรอกข้อมูลที่อยู่
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-light text-gray-900 uppercase tracking-wider mb-4">
                  ข้อมูลบัญชี
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-light text-gray-500 mb-1 uppercase tracking-wider">
                        วันที่สมัคร
                      </div>
                      <div className="text-sm font-light text-gray-900">
                        {formatDate(selectedUser.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-light text-gray-500 mb-1 uppercase tracking-wider">
                        อัปเดตล่าสุด
                      </div>
                      <div className="text-sm font-light text-gray-900">
                        {formatDate(selectedUser.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2 bg-black text-white hover:bg-gray-900 transition-colors text-sm font-light"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

