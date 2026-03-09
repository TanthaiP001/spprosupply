import { memo } from "react";
import Link from "next/link";
import Image from "next/image";

interface BannerHighlightProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

export default memo(function BannerHighlight({
  title,
  description,
  image,
  link,
}: BannerHighlightProps) {
  return (
    <Link
      href={link}
      className="group relative block w-full h-44 md:h-52 rounded-lg overflow-hidden mb-6 hover:shadow-xl transition-shadow"
    >
      <div className="relative w-full h-full">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1240px) 75vw, 900px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center p-4 md:p-6">
          <div className="text-white max-w-sm">
            <h2 className="text-xl md:text-2xl font-bold mb-1.5 drop-shadow-lg">
              {title}
            </h2>
            <p className="text-sm md:text-base mb-2 drop-shadow-md opacity-90">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
})

