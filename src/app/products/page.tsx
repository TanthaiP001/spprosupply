import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SWRConfig } from "swr";
import ProductsClient from "./ProductsClient";
import { getCategories, getProducts, safeFetch } from "@/lib/products";
import { categoryPath } from "@/lib/paths";
import { NOINDEX_FOLLOW, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type ProductsPageProps = {
  searchParams: SearchParams;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function resolveListing(searchParams: SearchParams) {
  const params = await searchParams;
  const categoryParam = firstParam(params.category)?.trim() || "";
  const q = firstParam(params.q)?.trim() || "";
  const page = Math.max(1, parseInt(firstParam(params.page) || "1", 10) || 1);

  const categories = await safeFetch(getCategories);
  const category = categoryParam
    ? categories?.find((c) => c.slug === categoryParam || c.id === categoryParam)
    : undefined;

  return { categoryParam, q, page, categories, category };
}

function withPage(path: string, page: number) {
  if (page <= 1) return path;
  return `${path}${path.includes("?") ? "&" : "?"}page=${page}`;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const { categoryParam, q, page, categories, category } = await resolveListing(searchParams);

  if (categoryParam && categories && !category) {
    return { title: "ไม่พบหมวดหมู่สินค้า", robots: NOINDEX_FOLLOW };
  }

  const pageSuffix = page > 1 ? ` (หน้า ${page})` : "";
  const metadata = category
    ? pageMetadata({
        title: `${category.name}${pageSuffix}`,
        description: `เลือกซื้อสินค้าหมวด${category.name} จาก SP Pro Supply ร้านสื่อสุขศึกษาและอุปกรณ์สาธารณสุข สั่งซื้อออนไลน์ได้ที่เว็บไซต์`,
        path: withPage(categoryPath(category), page),
      })
    : pageMetadata({
        title: `สินค้าทั้งหมด${pageSuffix}`,
        description:
          "รวมสื่อสุขศึกษาและอุปกรณ์สาธารณสุขจาก SP Pro Supply วงล้อ BMI วงล้อประเมินความเสี่ยงเบาหวานและความดัน แผ่นทดสอบสายตา และสื่อการเรียนรู้ด้านสุขภาพ",
        path: withPage("/products", page),
      });

  if (q) {
    return { ...metadata, alternates: { canonical: absoluteUrl("/products") }, robots: NOINDEX_FOLLOW };
  }
  return metadata;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { categoryParam, q, categories, category } = await resolveListing(searchParams);

  if (categoryParam && categories && !category) {
    notFound();
  }

  const products = await safeFetch(() => getProducts(category?.id, q || undefined));

  const apiParams = new URLSearchParams();
  if (category) apiParams.set("categoryId", category.id);
  if (q) apiParams.set("q", q);
  const productsKey = apiParams.toString() ? `/api/products?${apiParams.toString()}` : "/api/products";

  const fallback: Record<string, unknown> = {};
  if (categories) fallback["/api/categories"] = { categories };
  if (products) fallback[productsKey] = { products };

  return (
    <SWRConfig value={{ fallback }}>
      <ProductsClient />
    </SWRConfig>
  );
}
