import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

const DEFAULT_OG_IMAGE = {
  url: "/banner/banner-header.png",
  width: 1344,
  height: 768,
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  images?: { url: string; alt?: string; width?: number; height?: number }[];
  absoluteTitle?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  images,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImages = images?.length
    ? images.map((image) => ({ ...image, url: absoluteUrl(image.url) }))
    : [{ ...DEFAULT_OG_IMAGE, alt: title }];
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "th_TH",
      siteName: SITE_NAME,
      url,
      title: fullTitle,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImages.map((image) => image.url),
    },
  };
}

export const NOINDEX_FOLLOW: Metadata["robots"] = {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true },
};

export const NOINDEX_NOFOLLOW: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};
