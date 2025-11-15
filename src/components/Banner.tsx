"use client";

import { Search } from "lucide-react";

export default function Banner() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-200">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920)",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 container-custom h-full flex items-center">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-8">
          {/* Left Side - Text */}
          <div className="text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg leading-tight">
              สินค้าสร้างสรรค์
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-xl md:text-2xl drop-shadow-md">
                นวัตกรรมสุขภาพ
              </p>
            </div>
          </div>

          {/* Right Side - Search Bar */}
          <div className="w-full md:w-auto">
            <div className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="ค้นหาสินค้าใน Spprosupply"
                className="flex-1 px-4 py-2 text-gray-700 outline-none"
              />
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-md hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

