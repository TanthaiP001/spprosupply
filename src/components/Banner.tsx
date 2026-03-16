"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function Banner() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = keyword.trim();
    if (!query) {
      router.push("/products");
      return;
    }
    const params = new URLSearchParams();
    params.set("q", query);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="relative w-full h-[450px] overflow-hidden bg-gray-200">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/banner/banner-header.png)",
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
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-2"
            >
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="ค้นหาสินค้าใน Spprosupply"
                className="flex-1 px-4 py-2 text-gray-700 outline-none"
              />
              <button
                type="submit"
                className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

