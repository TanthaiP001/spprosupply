"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
const Footer = dynamic(() => import("@/components/Footer"));
import RightNavbar from "@/components/RightNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, ArrowLeft, Package, X, Upload, XCircle } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[] | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  rating: number;
  reviews: number;
  tag?: string;
  isHighlight: boolean;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    images: [] as string[],
    categoryId: "",
    tag: "",
    isHighlight: false,
    description: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login");
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [isAuthenticated, isAdmin, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products", {
        headers: {
          "x-user-id": user?.id || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        headers: {
          "x-user-id": user?.id || "",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      images: [],
      categoryId: "",
      tag: "",
      isHighlight: false,
      description: "",
    });
    setImageFiles([]);
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      images: (product.images && product.images.length > 0 ? product.images : [product.image]).slice(0, 3),
      categoryId: product.categoryId,
      tag: product.tag || "",
      isHighlight: product.isHighlight,
      description: product.description || "",
    });
    setImageFiles([]);
    setImagePreviews((product.images && product.images.length > 0 ? product.images : [product.image]).slice(0, 3));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user?.id || "",
        },
      });

      if (response.ok) {
        fetchProducts();
      } else {
        alert("เกิดข้อผิดพลาดในการลบสินค้า");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("เกิดข้อผิดพลาดในการลบสินค้า");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const limitedFiles = files.filter((f) => f.type.startsWith("image/")).slice(0, 3);
    if (limitedFiles.length === 0) return;

    // When selecting new files, treat it as a replacement.
    setImageFiles(limitedFiles);
    setFormData((prev) => ({ ...prev, images: [] }));

    const previews = await Promise.all(
      limitedFiles.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      )
    );
    setImagePreviews(previews);
  };

  const handleRemoveImageAt = (index: number) => {
    // Remove local files (and previews) first; when no local files exist, remove remote URLs.
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (imageFiles.length > 0) {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate images
    if (imageFiles.length === 0 && formData.images.length === 0) {
      alert("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
      return;
    }

    let imagesToSave = formData.images;

    // If there's new image files, upload them first
    if (imageFiles.length > 0) {
      setIsUploading(true);
      try {
        const uploaded = await Promise.all(
          imageFiles.map(async (imageFile) => {
            const uploadFormData = new FormData();
            uploadFormData.append("file", imageFile);

            const uploadResponse = await fetch("/api/admin/upload", {
              method: "POST",
              headers: {
                "x-user-id": user?.id || "",
              },
              body: uploadFormData,
            });

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
              throw new Error(uploadData.error || "เกิดข้อผิดพลาดในการอัปโหลด");
            }

            return uploadData.url as string;
          })
        );

        imagesToSave = uploaded.slice(0, 3);
      } catch (error) {
        console.error("Upload error:", error);
        alert(
          error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัปโหลด"
        );
        return;
      } finally {
        setIsUploading(false);
      }
    }

    if (!imagesToSave || imagesToSave.length === 0) {
      alert("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
      return;
    }

    imagesToSave = imagesToSave.slice(0, 3);

    const imageUrl = imagesToSave[0];

    // Prepare data with the correct images
    const submitData = {
      ...formData,
      image: imageUrl,
      images: imagesToSave,
    };

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

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
        setImageFiles([]);
        setImagePreviews([]);
        setFormData({
          name: "",
          price: "",
          images: [],
          categoryId: "",
          tag: "",
          isHighlight: false,
          description: "",
        });
        fetchProducts();
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error saving product:", error);
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
              จัดการสินค้า
            </h1>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-gray-900 transition-colors text-sm font-light"
            >
              <Plus className="w-4 h-4" />
              เพิ่มสินค้า
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-light">กำลังโหลดข้อมูล...</p>
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
                      ชื่อสินค้า
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      หมวดหมู่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      ราคา
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      Highlight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={64}
                            height={64}
                            sizes="64px"
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-light text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-light text-gray-600">
                          {product.category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-light text-gray-900">
                          ${product.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.isHighlight ? (
                          <span className="text-xs font-light text-green-600 bg-green-50 px-2 py-1 rounded">
                            ใช่
                          </span>
                        ) : (
                          <span className="text-xs font-light text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
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
                {editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
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
                  ชื่อสินค้า *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                    ราคา *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                    หมวดหมู่ *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                  รูปภาพสินค้า *
                </label>
                
                {/* Image Preview */}
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-2">
                      {imagePreviews.map((src, idx) => (
                        <div
                          key={`${src}-${idx}`}
                          className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                        >
                          <Image
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            width={400}
                            height={400}
                            sizes="(max-width: 768px) 28vw, 120px"
                            unoptimized={src.startsWith("data:")}
                            loading="lazy"
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageAt(idx)}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-600 hover:text-red-500 transition-colors"
                            aria-label={`ลบรูปที่ ${idx + 1}`}
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Section */}
                <div className="space-y-3">
                  <div className="border border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm font-light text-gray-600 mb-1">
                        {imageFiles.length > 0
                          ? imageFiles.length === 1
                            ? imageFiles[0].name
                            : `${imageFiles.length} รูปที่เลือก`
                          : "คลิกเพื่อเลือกรูปภาพ (สูงสุด 3 รูป)"}
                      </span>
                      <span className="text-xs font-light text-gray-400">
                        รองรับ JPG, PNG, GIF (สูงสุด 5MB)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                  Tag
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light"
                />
              </div>

              <div>
                <label className="block text-xs font-light text-gray-500 mb-2 uppercase tracking-wider">
                  คำอธิบาย
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm font-light resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isHighlight}
                    onChange={(e) => setFormData({ ...formData, isHighlight: e.target.checked })}
                    className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                  />
                  <span className="text-sm font-light text-gray-700">สินค้า Highlight</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 bg-black text-white py-3 px-4 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-light"
                >
                  {isUploading ? "กำลังอัปโหลด..." : editingProduct ? "อัปเดต" : "สร้าง"}
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

