interface ProductStructuredDataProps {
  product: {
    id: string;
    name: string;
    slug: string | null;
    price: number;
    image: string;
    description?: string | null;
    rating: number;
    reviews: number;
    category: {
      name: string;
    };
  };
  siteUrl: string;
}

export default function ProductStructuredData({ product, siteUrl }: ProductStructuredDataProps) {
  const productUrl = `${siteUrl}/products/${product.slug || product.id}`;
  const imageUrl = product.image.startsWith('http') 
    ? product.image 
    : `${siteUrl}${product.image}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: imageUrl,
    description: product.description || `${product.name} - ${product.category.name}`,
    sku: product.id,
    category: product.category.name,
    brand: {
      '@type': 'Brand',
      name: 'SP Pro Supply',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'THB',
      price: product.price.toString(),
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    aggregateRating: product.reviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviews.toString(),
    } : undefined,
  };

  // Remove undefined fields
  if (!structuredData.aggregateRating) {
    delete structuredData.aggregateRating;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

