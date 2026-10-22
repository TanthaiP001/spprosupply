import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeProductImages } from "@/lib/productImages";

const categorySelect = {
  select: { id: true, name: true, slug: true },
} as const;

const CUID_PATTERN = /^c[a-z0-9]{24,}$/;

export type CatalogProduct = Awaited<ReturnType<typeof findProducts>>[number];

function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function findProducts(where: Prisma.ProductWhereInput, take?: number) {
  const products = await prisma.product.findMany({
    where,
    include: { category: categorySelect },
    orderBy: { createdAt: "desc" },
    ...(take ? { take } : {}),
  });
  return products.map(normalizeProductImages);
}

export const getProductBySlugOrId = cache(async (param: string) => {
  const bySlug = CUID_PATTERN.test(param)
    ? null
    : await prisma.product.findUnique({
        where: { slug: param },
        include: { category: categorySelect },
      });
  const product =
    bySlug ??
    (await prisma.product.findUnique({
      where: { id: param },
      include: { category: categorySelect },
    }));
  return product ? toPlain(normalizeProductImages(product)) : null;
});

export const getRelatedProducts = cache(async (productId: string, categoryId: string) => {
  const products = await findProducts(
    { categoryId, id: { not: productId } },
    4
  );
  return toPlain(products);
});

export const getCategories = cache(async () => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { products: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return toPlain(categories);
});

export const getProducts = cache(async (categoryId?: string, q?: string) => {
  const where: Prisma.ProductWhereInput = {};
  if (categoryId) where.categoryId = categoryId;
  if (q && q.trim()) where.name = { contains: q.trim(), mode: "insensitive" };
  return toPlain(await findProducts(where));
});

export const getHighlightProducts = cache(async () => {
  return toPlain(await findProducts({ isHighlight: true }, 9));
});

export async function safeFetch<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    console.error("Server data fetch failed:", error);
    return undefined;
  }
}
