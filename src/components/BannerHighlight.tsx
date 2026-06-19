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
      className="focus-ring group relative mb-6 block h-44 w-full overflow-hidden rounded-lg transition-shadow hover:shadow-lg md:h-52"
    >
      <div className="relative h-full w-full">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={400}
          sizes="(max-width: 768px) 100vw, (max-width: 1240px) 75vw, 900px"
          className="hover-scale h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center p-4 md:p-6">
          <div className="max-w-sm text-white">
            <h2 className="mb-1.5 text-xl font-bold drop-shadow-lg text-balance md:text-2xl">
              {title}
            </h2>
            {description && (
              <p className="text-sm drop-shadow-md opacity-95 md:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
})
