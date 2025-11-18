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

const fetcher = async (url: string): Promise<ProductsResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
};

// Hook สำหรับดึง products ตาม category
export function useProducts(categoryId?: string) {
  const url = categoryId && categoryId !== 'all' 
    ? `/api/products?categoryId=${categoryId}`
    : '/api/products';
  
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    products: data?.products || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook สำหรับดึง highlight products
export function useHighlightProducts() {
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    '/api/products/highlight',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    products: data?.products || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook สำหรับดึง recommended products
export function useRecommendedProducts() {
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    '/api/products/recommendations',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    products: data?.products || [],
    isLoading,
    isError: error,
    mutate,
  };
}

