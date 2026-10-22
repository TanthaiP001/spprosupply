export function productPath(product: { slug: string | null; id: string }) {
  return `/products/${product.slug || product.id}`;
}

export function categoryPath(category: { slug: string }) {
  return `/products?category=${encodeURIComponent(category.slug)}`;
}
