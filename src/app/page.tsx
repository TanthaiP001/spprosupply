import type { Metadata } from "next";
import { SWRConfig } from "swr";
import HomeClient from "./HomeClient";
import OrganizationStructuredData from "@/components/OrganizationStructuredData";
import WebsiteStructuredData from "@/components/WebsiteStructuredData";
import { getCategories, getHighlightProducts, safeFetch } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const [categories, highlightProducts] = await Promise.all([
    safeFetch(getCategories),
    safeFetch(getHighlightProducts),
  ]);

  const fallback: Record<string, unknown> = {};
  if (categories) fallback["/api/categories"] = { categories };
  if (highlightProducts) fallback["/api/products/highlight"] = { products: highlightProducts };

  return (
    <>
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <SWRConfig value={{ fallback }}>
        <HomeClient />
      </SWRConfig>
    </>
  );
}
