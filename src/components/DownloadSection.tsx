"use client";

import { Download, FileText, Award } from "lucide-react";

export default function DownloadSection() {
  const handleDownload = (type: "brochure" | "certificate") => {
    // Handle download logic here
    console.log("Download:", type);
    // In a real app, this would trigger a file download
  };

  return (
    <div className="border-t border-gray-100 pt-8 mt-8">
      <h3 className="text-base font-light text-gray-900 mb-6 tracking-wide uppercase">ดาวน์โหลด</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => handleDownload("brochure")}
          className="w-full flex items-center gap-4 p-3.5 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left group"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-gray-100 transition-colors">
            <FileText className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-light text-gray-900 mb-0.5">โบรชัวร์</div>
            <div className="text-xs font-light text-gray-400">Download Brochure</div>
          </div>
          <Download className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        </button>

        <button
          onClick={() => handleDownload("certificate")}
          className="w-full flex items-center gap-4 p-3.5 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left group"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-gray-100 transition-colors">
            <Award className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-light text-gray-900 mb-0.5">ใบ Certificate</div>
            <div className="text-xs font-light text-gray-400">Download Certificate</div>
          </div>
          <Download className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

