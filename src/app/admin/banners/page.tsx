"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightNavbar from "@/components/RightNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, ArrowLeft, Image as ImageIcon, X, Upload, XCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  buttonText?: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBannersPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    buttonText: "ดูเพิ่มเติม",
    isActive: true,
    order: "0",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login");
      return;
    }
    fetchBanners();
  }, [isAuthenticated, isAdmin, router]);

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/admin/banners", {
        headers: {
          "x-user-id": user?.id || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBanners(data.banners || []);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      link: "#",
      buttonText: "ดูเพิ่มเติม",
      isActive: true,
      order: "0",
    });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image,
      link: banner.link,
      buttonText: banner.buttonText || "ดูเพิ่มเติม",
      isActive: banner.isActive,
      order: banner.order.toString(),
    });
    setImageFile(null);
    setImagePreview(banner.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบ Banner นี้?")) return;

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user?.id || "",
        },
      });

      if (response.ok) {
        fetchBanners();
      } else {
        const data = await response.json();
        alert(data.error || "เกิดข้อผิดพลาดในการลบ Banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("เกิดข้อผิดพลาดในการลบ Banner");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image: "" });
    const input = document.getElementById("banner-image-upload") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate image
    if (!imageFile && !formData.image) {
      alert("กรุณาอัปโหลดรูปภาพ");
      return;
    }

    let imageUrl = formData.image;

    // If there's a new image file, upload it first
    if (imageFile) {
      setIsUploading(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);

        const uploadResponse = await fetch("/api/admin/upload?type=banners", {
          method: "POST",
          headers: {
            "x-user-id": user?.id || "",
          },
          body: uploadFormData,
        });

        const uploadData = await uploadResponse.json();

        if (uploadResponse.ok) {
          imageUrl = uploadData.url;
        } else {
          alert(uploadData.error || "เกิดข้อผิดพลาดในการอัปโหลด");
          setIsUploading(false);
          return;
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("เกิดข้อผิดพลาดในการอัปโหลด");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    // Prepare data with the correct image URL
    const submitData = {
      ...formData,
      image: imageUrl,
      order: parseInt(formData.order) || 0,
    };

    try {
      const url = editingBanner
        ? `/api/admin/banners/${editingBanner.id}`
        : "/api/admin/banners";
      const method = editingBanner ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        setImageFile(null);
        setImagePreview(null);
        fetchBanners();
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("เกิดข้อผิดพลาด");
    }
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
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-light text-gray-600 hover:text-black transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปยัง Admin Panel
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
              จัดการ Banner
            </h1>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-gray-900 transition-colors text-sm font-light"
            >
              <Plus className="w-4 h-4" />
              เพิ่ม Banner
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-light">กำลังโหลดข้อมูล...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-light mb-6">
              ยังไม่มี Banner
            </p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors text-sm font-light"
            >
              <Plus className="w-4 h-4" />
              เพิ่ม Banner แรก
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      รูปภาพ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      หัวข้อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      ลำดับ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {banners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="relative w-24 h-16 bg-gray-50 rounded overflow-hidden">
                          <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-light text-gray-900">
                          {banner.title}
                        </div>
                        <div className="text-xs font-light text-gray-500 mt-1 line-clamp-2">
                          {banner.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {banner.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs font-light text-green-600 bg-green-50 px-2 py-1 rounded">
                            <Eye className="w-3 h-3" />
                            แสดง
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-light text-gray-400 bg-gray-50 px-2 py-1 rounded">
                            <EyeOff className="w-3 h-3" />
                            ซ่อน
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-light text-gray-600">
                          {banner.order}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(banner)}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            title="แก้ไข"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-light text-gray-900">
                {editingBanner ? "แก้ไข Banner" : "เพิ่ม Banner ใหม่"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                  หัวข้อ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                />
              </div>

              <div>
                <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                  คำอธิบาย *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                  รูปภาพ Banner *
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 relative">
                    <div className="relative w-full h-48 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Section */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    id="banner-image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="banner-image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-light text-gray-600 mb-1">
                      {imageFile ? imageFile.name : "คลิกเพื่อเลือกรูปภาพ"}
                    </span>
                    <span className="text-xs font-light text-gray-400">
                      รองรับ JPG, PNG, GIF (สูงสุด 5MB)
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                    ข้อความปุ่ม
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                    ลำดับ
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                  />
                  <span className="text-sm font-light text-gray-700">แสดง Banner</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 bg-black text-white py-3 px-4 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-light"
                >
                  {isUploading ? "กำลังอัปโหลด..." : editingBanner ? "อัปเดต" : "สร้าง"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white text-gray-900 py-3 px-4 hover:bg-gray-50 transition-colors text-sm font-light border border-gray-200"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

