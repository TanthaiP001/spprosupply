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
    <section
      aria-label="ค้นหาสินค้า"
      className="relative h-[320px] w-full overflow-hidden bg-gray-200 md:h-[400px] lg:h-[450px]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/banner/banner-header.png)" }}
        role="img"
        aria-label="สินค้าสร้างสรรค์ นวัตกรรมสุขภาพ"
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container-custom relative z-10 flex h-full items-center">
        <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="text-white">
            <h1 className="mb-3 text-4xl font-bold leading-tight drop-shadow-lg text-balance md:text-5xl lg:text-6xl">
              สินค้าสร้างสรรค์
            </h1>
            <p className="text-lg drop-shadow-md md:text-xl lg:text-2xl">
              นวัตกรรมสุขภาพ
            </p>
          </div>

          <div className="w-full md:w-auto md:min-w-[340px] lg:min-w-[400px]">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-lg"
              role="search"
            >
              <label htmlFor="home-search" className="sr-only">
                ค้นหาสินค้า
              </label>
              <input
                id="home-search"
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="ค้นหาสินค้าใน Spprosupply"
                className="focus-ring min-h-11 flex-1 rounded-md px-4 py-2 text-gray-800 placeholder:text-gray-500"
                autoComplete="off"
              />
              <button
                type="submit"
                className="focus-ring flex min-h-11 items-center gap-2 rounded-md bg-green-700 px-5 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-green-800"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                ค้นหา
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
