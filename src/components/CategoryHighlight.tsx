"use client";

import Link from "next/link";
import { categoryBanners } from "@/data/mockData";

export default function CategoryHighlight() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categoryBanners.map((banner) => (
        <Link
          key={banner.id}
          href={banner.link}
          className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
        >
          <div className="relative h-48 md:h-64 bg-gradient-to-br from-green-800 via-green-700 to-green-600">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-6">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {banner.title}
              </h3>
              <p className="text-lg md:text-xl opacity-90">
                {banner.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

