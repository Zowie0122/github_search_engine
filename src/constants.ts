// Sort
export const SORT_OPTIONS = {
  updated: "updated",
  created: "created",
  stars: "stars",
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;
export type Sort = (typeof SORT_OPTIONS)[SortKey];

// Order
export const ORDER_OPTIONS = {
  asc: "asc",
  desc: "desc",
} as const;

export type OrderKey = keyof typeof ORDER_OPTIONS;
export type Order = (typeof ORDER_OPTIONS)[OrderKey];
