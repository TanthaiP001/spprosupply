"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";

export default function DebugPage() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [apiRole, setApiRole] = useState<any>(null);
  const [localStorageUser, setLocalStorageUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const stored = localStorage.getItem("user");
    if (stored) {
      setLocalStorageUser(JSON.parse(stored));
    }

    // Get role from API
    if (user?.id) {
      fetch("/api/admin/check-role", {
        headers: {
          "x-user-id": user.id,
        },
      })
        .then((res) => res.json())
        .then((data) => setApiRole(data))
        .catch((err) => console.error("API Error:", err));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <RightNavbar />

      <div className="container-custom py-12">
        <h1 className="text-3xl font-light mb-8">Debug: ตรวจสอบ Role</h1>

        <div className="space-y-6">
          {/* AuthContext State */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-light mb-4">AuthContext State</h2>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <span className="text-gray-500">isAuthenticated:</span>{" "}
                <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
                  {String(isAuthenticated)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">isAdmin:</span>{" "}
                <span className={isAdmin ? "text-green-600" : "text-red-600"}>
                  {String(isAdmin)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">user:</span>
                <pre className="mt-2 p-3 bg-gray-50 rounded overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* LocalStorage */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-light mb-4">LocalStorage</h2>
            {localStorageUser ? (
              <div className="space-y-2 font-mono text-sm">
                <div>
                  <span className="text-gray-500">role:</span>{" "}
                  <span className={localStorageUser.role === "admin" ? "text-green-600" : "text-red-600"}>
                    {localStorageUser.role || "undefined"}
                  </span>
                </div>
                <pre className="mt-2 p-3 bg-gray-50 rounded overflow-auto">
                  {JSON.stringify(localStorageUser, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500">ไม่มีข้อมูลใน localStorage</p>
            )}
          </div>

          {/* API Response */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-light mb-4">API Response</h2>
            {apiRole ? (
              <div className="space-y-2 font-mono text-sm">
                <div>
                  <span className="text-gray-500">isAdmin:</span>{" "}
                  <span className={apiRole.user?.isAdmin ? "text-green-600" : "text-red-600"}>
                    {String(apiRole.user?.isAdmin)}
                  </span>
                </div>
                <pre className="mt-2 p-3 bg-gray-50 rounded overflow-auto">
                  {JSON.stringify(apiRole, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500">กำลังโหลด...</p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-light mb-4">วิธีตรวจสอบ Role</h2>
            <div className="space-y-2 text-sm">
              <p><strong>1. ตรวจสอบใน Database:</strong></p>
              <code className="block bg-white p-2 rounded mt-1">
                npm run check-admin
              </code>
              
              <p className="mt-4"><strong>2. ตรวจสอบใน Browser Console:</strong></p>
              <code className="block bg-white p-2 rounded mt-1">
                JSON.parse(localStorage.getItem('user'))
              </code>
              
              <p className="mt-4"><strong>3. ตรวจสอบใน Prisma Studio:</strong></p>
              <code className="block bg-white p-2 rounded mt-1">
                npm run db:studio
              </code>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

