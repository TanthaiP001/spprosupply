import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spprosupply.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    // Fetch all products
    const products = await prisma.product.findMany({
      where: {
        slug: {
          not: null,
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Fetch all categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Product pages
    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Category pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/products?category=${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...productPages, ...categoryPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if database query fails
    return staticPages;
  }
}

