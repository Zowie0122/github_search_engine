import { QueryClient } from "@tanstack/react-query";

export const STALE_TIME_DEFAULT = 5_000;
export const GC_TIME_DEFAULT = 120_000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_DEFAULT,
      gcTime: GC_TIME_DEFAULT,
      refetchOnWindowFocus: false,
    },
  },
});
