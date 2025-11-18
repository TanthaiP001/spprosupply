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

const fetcher = async (url: string): Promise<BannersResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch banners');
  }
  return res.json();
};

export function useBanners() {
  const { data, error, isLoading, mutate } = useSWR<BannersResponse>(
    '/api/banners',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 120000, // Cache for 2 minutes
    }
  );

  return {
    banners: data?.banners || [],
    isLoading,
    isError: error,
    mutate,
  };
}

