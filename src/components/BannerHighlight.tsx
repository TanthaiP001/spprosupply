"use client";

import Link from "next/link";
import Image from "next/image";

interface BannerHighlightProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function BannerHighlight({
  title,
  description,
  image,
  link,
}: BannerHighlightProps) {
  return (
    <Link
      href={link}
      className="group relative block w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6 hover:shadow-xl transition-shadow"
    >
      <div className="relative w-full h-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center p-6 md:p-10">
          <div className="text-white max-w-md">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg">
              {title}
            </h2>
            <p className="text-base md:text-lg mb-4 drop-shadow-md opacity-90">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

