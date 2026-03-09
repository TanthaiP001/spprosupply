import useSWR from 'swr';

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

interface BannersResponse {
  banners: Banner[];
}

export function useBanners() {
  const { data, error, isLoading, mutate } = useSWR<BannersResponse>(
    '/api/banners',
    {
      dedupingInterval: 120_000,
      refreshInterval: 300_000,
    }
  );

  return {
    banners: data?.banners || [],
    isLoading,
    isError: error,
    mutate,
  };
}

