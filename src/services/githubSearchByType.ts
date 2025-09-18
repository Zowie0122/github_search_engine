import api from "./githubSearchApiBase";
import {
  ORDER_OPTIONS,
  SORT_OPTIONS,
  type Order,
  type Sort,
} from "../constants";
import type { SearchResponseGeneric } from "../types/SearchResponseGeneric";

export const QUERY_PER_PAGE_DEFAULT = 10;

/** Endpoints supported by GitHub Search API */
export const GITHUB_SEARCH_TYPES = {
  issues: { value: "issues", path: "issues", requiresAuth: true },
  repositories: {
    value: "repositories",
    path: "repositories",
    requiresAuth: false,
  },
  code: { value: "code", path: "code", requiresAuth: true },
  commits: { value: "commits", path: "commits", requiresAuth: true },
  users: { value: "users", path: "users", requiresAuth: false },
  topics: { value: "topics", path: "topics", requiresAuth: false },
  labels: { value: "labels", path: "labels", requiresAuth: false },
} as const;

export type GithubSearchTypeKey = keyof typeof GITHUB_SEARCH_TYPES;
export type GithubSearchType =
  (typeof GITHUB_SEARCH_TYPES)[GithubSearchTypeKey]["value"];

/** Generic params for all search endpoints.
 * Some endpoints (e.g., labels) may require extra params via `extra`.
 */
export type GithubSearchParams = {
  type: GithubSearchType;
  queryString: string;
  page?: number;
  perPage?: number;
  sort?: Sort | string;
  order?: Order;
  /** Extra endpoint-specific params (e.g., repository_id for labels) */
  extra?: Record<string, string | number | boolean | undefined>;
  /** Force enabling/disabling text-match header (default auto for issues/code) */
  acceptTextMatchOverride?: boolean;
};

export type GithubSearchResponse = SearchResponseGeneric;

/** Generic GitHub search with optional text-match header */
export async function searchGithubBySearch({
  type,
  queryString,
  page = 1,
  perPage = QUERY_PER_PAGE_DEFAULT,
  sort = SORT_OPTIONS.updated as Sort,
  order = ORDER_OPTIONS.desc,
  extra,
  acceptTextMatchOverride,
}: GithubSearchParams): Promise<GithubSearchResponse> {
  const path = `/search/${type}`;

  // issues & code support text-match; others search ignore the header
  const shouldTextMatchDefault =
    type === GITHUB_SEARCH_TYPES.issues.value ||
    type === GITHUB_SEARCH_TYPES.code.value;
  const acceptTextMatch = acceptTextMatchOverride ?? shouldTextMatchDefault;

  const { data } = await api.get<GithubSearchResponse>(path, {
    params: {
      q: queryString,
      page,
      per_page: perPage,
      sort,
      order,
      ...(extra ?? {}),
    },
    headers: {
      Accept: acceptTextMatch
        ? "application/vnd.github.text-match+json"
        : "application/vnd.github+json",
    },
  });

  return data;
}
