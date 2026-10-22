import JsonLd from "@/components/JsonLd";
import { categoryPath, productPath } from "@/lib/paths";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

interface ProductStructuredDataProps {
  product: {
    id: string;
    name: string;
    slug: string | null;
    price: number;
    image: string;
    images: string[];
    description?: string | null;
    category: {
      name: string;
      slug: string;
    };
  };
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const productUrl = absoluteUrl(productPath(product));
  const images = (product.images.length > 0 ? product.images : [product.image]).map(absoluteUrl);
  const description = product.description?.trim();

  const productData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    image: images,
    ...(description ? { description } : {}),
    sku: product.id,
    category: product.category.name,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "THB",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE_URL}/#organization`, "@type": "Organization", name: SITE_NAME },
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "สินค้า", item: absoluteUrl("/products") },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category.name,
        item: absoluteUrl(categoryPath(product.category)),
      },
      { "@type": "ListItem", position: 4, name: product.name, item: productUrl },
    ],
  };

  return <JsonLd data={[productData, breadcrumbData]} />;
}
