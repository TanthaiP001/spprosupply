import useSWR from 'swr';

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count: {
    products: number;
  };
}

interface CategoriesResponse {
  categories: Category[];
}

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<CategoriesResponse>(
    '/api/categories',
    {
      dedupingInterval: 300_000,
      refreshInterval: 600_000,
    }
  );

  return {
    categories: data?.categories || [],
    isLoading,
    isError: error,
    mutate,
  };
}

