const range = (start: number, end: number): number[] =>
  Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);

/**
 * Generates an array of page numbers for pagination navigation.
 *
 * Ensures that a fixed number of page numbers (`size`) are always shown,
 * centering the current page when possible. If the current page is near the
 * start or end, the range shifts accordingly to always display the desired
 * number of pages, without exceeding the total number of pages.
 *
 * @param current - The current active page (1-based index).
 * @param total - The total number of pages available.
 * @param size - The number of page numbers to display in the navigation (defaults to `PAGES_NAV_DEFAULT`).
 * @returns An array of page numbers to display in the pagination navigation.
 */
export const buildPagesNav = (
  current: number,
  total: number,
  size: number
): number[] => {
  const halfSize = Math.floor(size / 2);

  let start = current - halfSize;
  let end = current + halfSize;

  if (start < 1) {
    end += 1 - start;
    start = 1;
  }
  if (end > total) {
    start -= end - total;
    end = total;
  }

  return range(start, end);
};
