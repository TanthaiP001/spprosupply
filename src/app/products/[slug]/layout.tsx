import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface ProductLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spprosupply.com';
const siteName = 'SP Pro Supply';

const getProduct = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
});

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { slug: { not: null } },
    select: { slug: true },
  });
  return products
    .filter((p): p is { slug: string } => p.slug !== null)
    .map((p) => ({ slug: p.slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const product = await getProduct(slug);

    if (!product) {
      return {
        title: 'ไม่พบสินค้า',
      };
    }

    const productUrl = `${siteUrl}/products/${product.slug}`;
    const imageUrl = product.image.startsWith('http') 
      ? product.image 
      : `${siteUrl}${product.image}`;
    const description = product.description || `${product.name} - ${product.category.name} | ${siteName}`;

    return {
      title: product.name,
      description: description,
      keywords: [
        product.name,
        product.category.name,
        'SP Pro Supply',
        'สินค้าออนไลน์',
        'ซื้อของออนไลน์',
      ],
      openGraph: {
        type: 'website',
        title: product.name,
        description: description,
        url: productUrl,
        siteName: siteName,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: description,
        images: [imageUrl],
      },
      alternates: {
        canonical: productUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'ไม่พบสินค้า',
    };
  }
}

export default async function ProductLayout({ params, children }: ProductLayoutProps) {
  const { slug } = await params;
  
  try {
    const product = await getProduct(slug);

    if (!product) {
      notFound();
    }

    return (
      <>
        {children}
      </>
    );
  } catch (error) {
    notFound();
  }
}

