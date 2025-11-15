"use client";

import { useState } from "react";
import { Download, X, Eye } from "lucide-react";
import Image from "next/image";

export default function DownloadSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const handleDownload = (type: "brochure" | "certificate", e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle download logic here
    console.log("Download:", type);
    // In a real app, this would trigger a file download
  };

  const handleViewImage = (imageSrc: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(imageSrc);
    setSelectedTitle(title);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedTitle("");
  };

  return (
    <>
      <div className="border-t border-gray-100 pt-8 mt-8">
        <h3 className="text-base font-light text-gray-900 mb-6 tracking-wide uppercase">ดาวน์โหลด</h3>
        
        <div className="space-y-2">
          <div className="w-full flex items-center gap-4 p-3.5 border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all text-left group rounded-md">
            <button
              onClick={(e) => handleViewImage("/assets/download/brochure1.jpg", "โบรชัวร์", e)}
              className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-md overflow-hidden border border-gray-100 group-hover:border-green-200 transition-colors relative cursor-pointer hover:ring-2 hover:ring-green-400"
            >
              <Image
                src="/assets/download/brochure1.jpg"
                alt="โบรชัวร์"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-light text-gray-900 mb-0.5">โบรชัวร์</div>
              <div className="text-xs font-light text-gray-400">Download Brochure</div>
            </div>
            <button
              onClick={(e) => handleDownload("brochure", e)}
              className="p-2 hover:bg-green-100 rounded-md transition-colors"
              title="ดาวน์โหลด"
            >
              <Download className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-600 flex-shrink-0 transition-colors" />
            </button>
          </div>

          <div className="w-full flex items-center gap-4 p-3.5 border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all text-left group rounded-md">
            <button
              onClick={(e) => handleViewImage("/assets/download/cert.jpg", "ใบ Certificate", e)}
              className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-md overflow-hidden border border-gray-100 group-hover:border-green-200 transition-colors relative cursor-pointer hover:ring-2 hover:ring-green-400"
            >
              <Image
                src="/assets/download/cert.jpg"
                alt="ใบ Certificate"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-light text-gray-900 mb-0.5">ใบ Certificate</div>
              <div className="text-xs font-light text-gray-400">Download Certificate</div>
            </div>
            <button
              onClick={(e) => handleDownload("certificate", e)}
              className="p-2 hover:bg-green-100 rounded-md transition-colors"
              title="ดาวน์โหลด"
            >
              <Download className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-600 flex-shrink-0 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white hover:text-green-400 transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{selectedTitle}</h3>
              </div>
              <div className="relative w-full h-auto max-h-[70vh] overflow-auto">
                <Image
                  src={selectedImage}
                  alt={selectedTitle}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

