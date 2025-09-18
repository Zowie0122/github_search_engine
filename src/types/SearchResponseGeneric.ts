import type { SearchResultItem } from "./GithubSearchItem";

export interface SearchResponseGeneric {
  total_count: number;
  incomplete_results: boolean;
  items: SearchResultItem[];
}
