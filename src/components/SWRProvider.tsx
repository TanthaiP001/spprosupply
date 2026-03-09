'use client';

import { SWRConfig } from 'swr';

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateIfStale: true,
  keepPreviousData: true,
  errorRetryCount: 2,
  errorRetryInterval: 5000,
  fetcher: async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  },
};

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
