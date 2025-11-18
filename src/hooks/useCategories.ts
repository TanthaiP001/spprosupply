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

const fetcher = async (url: string): Promise<CategoriesResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return res.json();
};

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<CategoriesResponse>(
    '/api/categories',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // Cache for 5 minutes (categories change less frequently)
    }
  );

  return {
    categories: data?.categories || [],
    isLoading,
    isError: error,
    mutate,
  };
}

