"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function MemberLogin() {
  const router = useRouter();
  const { login, isAuthenticated, user, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);
    if (result.success && result.user) {
      setEmail("");
      setPassword("");
      // Redirect based on user role
      if (result.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } else {
      setError("ชื่อผู้ใช้/อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="border-t border-gray-100 pt-8 mt-8">
        <h3 className="text-base font-light text-gray-900 mb-6 tracking-wide uppercase">
          ระบบสมาชิก
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm font-light text-gray-900 mb-1">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs font-light text-gray-500">{user.email}</p>
          </div>
          <Link
            href={isAdmin ? "/admin" : "/profile"}
            className="block w-full bg-black text-white py-2.5 px-4 hover:bg-gray-900 transition-colors text-sm font-light text-center border border-black"
          >
            {isAdmin ? "ไปที่ Admin Panel" : "ไปที่โปรไฟล์"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 pt-8 mt-8">
      <h3 className="text-base font-light text-gray-900 mb-6 tracking-wide uppercase">ระบบสมาชิก</h3>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-light text-gray-500 mb-2.5 uppercase tracking-wider">
            ชื่อผู้ใช้/อีเมล
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="กรอกชื่อผู้ใช้หรืออีเมล"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light bg-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2.5 px-4 hover:bg-gray-900 transition-colors text-sm font-light border border-black"
        >
          เข้าสู่ระบบ
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-xs font-light">
            {error}
          </div>
        )}

        <Link
          href="/register"
          className="block w-full bg-white text-gray-900 py-2.5 px-4 hover:bg-gray-50 transition-colors text-sm font-light border border-gray-200 text-center"
        >
          สมัครสมาชิก
        </Link>
      </form>
    </div>
  );
}

