import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { categoryPath } from '@/lib/paths';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/') },
    { url: absoluteUrl('/products') },
    { url: absoluteUrl('/payment') },
    { url: absoluteUrl('/contact') },
  ];

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { slug: { not: null } },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.category.findMany({
        where: { products: { some: {} } },
        select: {
          slug: true,
          updatedAt: true,
          products: {
            select: { updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 1,
          },
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
    ]);

    const latestProductUpdate = products[0]?.updatedAt;
    const pages: MetadataRoute.Sitemap = staticPages.map((page) =>
      page.url === absoluteUrl('/products') && latestProductUpdate
        ? { ...page, lastModified: latestProductUpdate }
        : page
    );

    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => {
      const latest = [category.updatedAt, category.products[0]?.updatedAt]
        .filter((d): d is Date => d instanceof Date)
        .sort((a, b) => b.getTime() - a.getTime())[0];
      return {
        url: absoluteUrl(categoryPath(category)),
        ...(latest ? { lastModified: latest } : {}),
      };
    });

    const productPages: MetadataRoute.Sitemap = products
      .filter((product): product is { slug: string; updatedAt: Date } => product.slug !== null)
      .map((product) => ({
        url: absoluteUrl(`/products/${encodeURIComponent(product.slug)}`),
        lastModified: product.updatedAt,
      }));

    return [...pages, ...categoryPages, ...productPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
