export function parseProductImageField(imageField: string): string[] {
  const trimmed = (imageField || "").trim();
  if (!trimmed) return [];

  // New format: store multiple image URLs as JSON array string in the existing `image` column.
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .filter((u) => typeof u === "string" && u.trim().length > 0)
          .slice(0, 3);
      }
    } catch {
      // If parsing fails, fall through to legacy single-url behavior.
    }
  }

  // Legacy format: `image` already stores a single URL.
  return [imageField];
}

export function normalizeProductImages<T extends { image: string }>(product: T) {
  const images = parseProductImageField(product.image);
  const image = images[0] ?? product.image;
  return {
    ...product,
    image,
    images,
  };
}

