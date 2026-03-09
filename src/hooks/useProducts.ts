import useSWR from 'swr';

interface Product {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  image: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  rating: number;
  reviews: number;
  tag?: string | null;
  isHighlight: boolean;
  description?: string | null;
}

interface ProductsResponse {
  products: Product[];
}

export function useProducts(categoryId?: string) {
  const url = categoryId && categoryId !== 'all' 
    ? `/api/products?categoryId=${categoryId}`
    : '/api/products';
  
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(url, {
    dedupingInterval: 60_000,
    refreshInterval: 120_000,
  });

  return {
    products: data?.products || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useHighlightProducts() {
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    '/api/products/highlight',
    {
      dedupingInterval: 60_000,
      refreshInterval: 120_000,
    }
  );

  return {
    products: data?.products || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useRecommendedProducts() {
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    '/api/products/recommendations',
    {
      dedupingInterval: 60_000,
      refreshInterval: 120_000,
    }
  );

  return {
    products: data?.products || [],
    isLoading,
    isError: error,
    mutate,
  };
}

