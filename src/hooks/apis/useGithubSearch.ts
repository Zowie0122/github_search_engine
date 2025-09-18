import { useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";

import {
  ORDER_OPTIONS,
  SORT_OPTIONS,
  type Order,
  type Sort,
} from "../../constants";
import { GithubSearchError } from "../../error";
import {
  searchGithubBySearch,
  type GithubSearchResponse,
  type GithubSearchType,
} from "../../services/githubSearchByType";

export const QUERY_PER_PAGE_DEFAULT = 10;
export const QUERY_PAGE_UNIT_DEFAULT = 1;
export const TIMEOUT_IN_MS_DEFAULT = 1500;
export const LIMIT_RATE_MAX = 1000;

export const PREFETCH_NEXT_PAGE_ON_IDLE = true;
export const PREFETCH_FURTHER_PAGE_ON_VIEWPORT = true;
export const PREFETCH_ON_HOVER_FOCUS = false;

export type UseGithubSearchConfig = {
  /** Which /search endpoint to hit (default: "issues") */
  type?: GithubSearchType;

  queryString: string;
  perPage?: number;
  enabled?: boolean;
  currentPage?: number;
  /** Allow endpoint-specific sort strings */
  sort?: Sort | string;
  order?: Order;

  /** Prefetch next page when browser is idle (default: true) */
  isPrefetchNextOnIdle?: boolean;
  /** Enable hover/focus prefetch on page nav (default: true) */
  isPrefetchOnHoverFocus?: boolean;
  /** Debounce for hover/focus prefetch in ms (default: 150) */
  hoverPrefetchDelayMs?: number;
  /** Extra endpoint-specific params (e.g., labels: repository_id) */
  extraParams?: Record<string, string | number | boolean | undefined>;
};

const requestIdle = (cb: () => void) =>
  (window as any).requestIdleCallback?.(cb, {
    timeout: TIMEOUT_IN_MS_DEFAULT,
  }) ?? window.setTimeout(cb, 0);

export function useGithubSearch({
  type = "issues",
  queryString,
  perPage = QUERY_PER_PAGE_DEFAULT,
  enabled = true,
  sort = SORT_OPTIONS.updated,
  order = ORDER_OPTIONS.desc,
  currentPage = 1,
  isPrefetchNextOnIdle = PREFETCH_NEXT_PAGE_ON_IDLE,
  isPrefetchOnHoverFocus = true,
  hoverPrefetchDelayMs = 150,
  extraParams,
}: UseGithubSearchConfig) {
  const qc = useQueryClient();

  // --- Rate/limit-aware prefetch cap ---
  const canPrefetch = useCallback(
    (targetPage: number, totalCount?: number) => {
      if (!totalCount) return false;
      const totalCap = Math.min(totalCount, LIMIT_RATE_MAX);
      if (targetPage < 1) return false;
      if ((targetPage - 1) * perPage >= totalCap) return false;
      return true;
    },
    [perPage]
  );

  const key = useMemo(
    () => [type, queryString, currentPage, perPage, sort, order] as const,
    [type, queryString, currentPage, perPage, sort, order]
  );

  const query = useQuery<GithubSearchResponse, GithubSearchError>({
    queryKey: key,
    queryFn: async () => {
      const res = await searchGithubBySearch({
        type,
        queryString,
        page: currentPage,
        perPage,
        sort,
        order,
        extra: extraParams,
      });

      // TODO: type guard for response
      return res;
    },
    enabled: enabled && !!queryString.trim(),
  });

  // ---------- Prefetch NEXT page on idle ----------
  useEffect(() => {
    const data = query.data;
    if (!isPrefetchNextOnIdle || !data || data.total_count === 0) return;

    const nextPage = currentPage + 1;
    if (!canPrefetch(nextPage, data.total_count)) return;

    const nextKey: QueryKey = [
      type,
      queryString,
      nextPage,
      perPage,
      sort,
      order,
    ];
    if (qc.getQueryData(nextKey)) return;

    const id = requestIdle(() => {
      if (!data.items?.length) return;
      qc.prefetchQuery({
        queryKey: nextKey,
        queryFn: () =>
          searchGithubBySearch({
            type,
            queryString,
            page: nextPage,
            perPage,
            sort,
            order,
            extra: extraParams,
          }),
      });
    });

    return () => {
      if ("cancelIdleCallback" in window)
        (window as any).cancelIdleCallback(id);
      else clearTimeout(id as number);
    };
  }, [
    isPrefetchNextOnIdle,
    query.data,
    currentPage,
    perPage,
    queryString,
    sort,
    order,
    type,
    qc,
    extraParams,
    canPrefetch,
  ]);

  // ---------- Hover/Focus prefetch ----------
  const hoverTimersRef = useRef<Map<number, number>>(new Map());

  const queuePrefetch = useCallback(
    (targetPage: number) => {
      const data = query.data;
      if (!isPrefetchOnHoverFocus || !data) return;
      if (!canPrefetch(targetPage, data.total_count)) return;

      const targetKey: QueryKey = [
        type,
        queryString,
        targetPage,
        perPage,
        sort,
        order,
      ];
      if (qc.getQueryData(targetKey)) return;

      const existing = hoverTimersRef.current.get(targetPage);
      if (existing) window.clearTimeout(existing);

      const tid = window.setTimeout(() => {
        qc.prefetchQuery({
          queryKey: targetKey,
          queryFn: () =>
            searchGithubBySearch({
              type,
              queryString,
              page: targetPage,
              perPage,
              sort,
              order,
              extra: extraParams,
            }),
        });
        hoverTimersRef.current.delete(targetPage);
      }, hoverPrefetchDelayMs);

      hoverTimersRef.current.set(targetPage, tid);
    },
    [
      isPrefetchOnHoverFocus,
      query.data,
      queryString,
      perPage,
      sort,
      order,
      hoverPrefetchDelayMs,
      type,
      qc,
      extraParams,
      canPrefetch,
    ]
  );

  useEffect(() => {
    return () => {
      hoverTimersRef.current.forEach((tid) => window.clearTimeout(tid));
      hoverTimersRef.current.clear();
    };
  }, []);

  const getNavHoverPrefetchProps = useCallback(
    (targetPage: number) => ({
      onMouseEnter: () => queuePrefetch(targetPage),
      onFocus: () => queuePrefetch(targetPage),
      onTouchStart: () => queuePrefetch(targetPage),
    }),
    [queuePrefetch]
  );

  const prefetchPage = useCallback(
    (targetPage: number) => {
      const data = query.data;
      if (!data) return;
      if (!canPrefetch(targetPage, data.total_count)) return;

      const targetKey: QueryKey = [
        type,
        queryString,
        targetPage,
        perPage,
        sort,
        order,
      ];
      if (qc.getQueryData(targetKey)) return;

      qc.prefetchQuery({
        queryKey: targetKey,
        queryFn: () =>
          searchGithubBySearch({
            type,
            queryString,
            page: targetPage,
            perPage,
            sort,
            order,
            extra: extraParams,
          }),
      });
    },
    [
      qc,
      query.data,
      queryString,
      perPage,
      sort,
      order,
      type,
      extraParams,
      canPrefetch,
    ]
  );

  return {
    ...query,
    prefetchPage,
    getNavHoverPrefetchProps,
  };
}
