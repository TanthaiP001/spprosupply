import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound, permanentRedirect } from "next/navigation";
import Header from "@/components/Header";
import RightNavbar from "@/components/RightNavbar";
import ProductStructuredData from "@/components/ProductStructuredData";
import ProductDetailClient from "./ProductDetailClient";
import { prisma } from "@/lib/prisma";
import { getProductBySlugOrId, getRelatedProducts } from "@/lib/products";
import { categoryPath, productPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";
import { truncateDescription } from "@/lib/site";

const Footer = dynamic(() => import("@/components/Footer"));

export const revalidate = 3600;
export const dynamicParams = true;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { slug: { not: null } },
      select: { slug: true },
    });
    return products
      .filter((p): p is { slug: string } => p.slug !== null)
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

function decodeSlug(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function productDescription(product: { name: string; description?: string | null; category: { name: string } }) {
  if (product.description?.trim()) {
    return truncateDescription(product.description);
  }
  return `ซื้อ${product.name} จาก SP Pro Supply หมวด${product.category.name} สั่งซื้อออนไลน์ได้ที่เว็บไซต์ SP Pro Supply`;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugOrId(decodeSlug(slug));

  if (!product) {
    return { title: "ไม่พบสินค้า", robots: { index: false, follow: true } };
  }

  return pageMetadata({
    title: product.name,
    description: productDescription(product),
    path: productPath(product),
    images: (product.images.length > 0 ? product.images : [product.image]).map((url) => ({
      url,
      alt: product.name,
    })),
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const product = await getProductBySlugOrId(slug);

  if (!product) {
    notFound();
  }

  if (product.slug && product.slug !== slug) {
    permanentRedirect(productPath(product));
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId);

  return (
    <div className="min-h-screen bg-white">
      <ProductStructuredData product={product} />
      <Header />
      <RightNavbar />

      <nav aria-label="breadcrumb" className="border-b border-gray-100 bg-gray-50">
        <ol className="container-custom flex flex-wrap items-center gap-2 py-4 text-sm font-light text-gray-600">
          <li>
            <Link href="/" className="hover:text-black transition-colors">
              หน้าแรก
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/products" className="hover:text-black transition-colors">
              สินค้า
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={categoryPath(product.category)} className="hover:text-black transition-colors">
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-gray-900">
            {product.name}
          </li>
        </ol>
      </nav>

      <ProductDetailClient product={product} relatedProducts={relatedProducts} />

      <Footer />
    </div>
  );
}
