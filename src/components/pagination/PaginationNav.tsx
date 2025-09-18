import { useEffect, useMemo, useState } from "react";
import TextInput from "../common/TextInput";
import Button from "../common/Button";
import { buildPagesNav } from "../../utils/buildPagesNav";
import { useDebounce } from "../../hooks/utils/useDebounce";

type HoverPrefetchHandlers = {
  onMouseEnter?: () => void;
  onFocus?: () => void;
  onTouchStart?: () => void;
};

type Props = {
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  pageToShow: number;
  onPageClicked: (page: number) => void;
  onPrefetch?: (page: number) => void;
  getNavHoverPrefetchProps?: (page: number) => HoverPrefetchHandlers;
};

export default function PaginationNav({
  isLoading,
  currentPage,
  totalPages,
  pageToShow,
  onPageClicked,
  onPrefetch,
  getNavHoverPrefetchProps,
}: Props) {
  if (totalPages <= 1) return null;

  const [pageInput, setPageInput] = useState("");

  const pages = useMemo(
    () => buildPagesNav(currentPage, totalPages, pageToShow),
    [currentPage, totalPages, pageToShow]
  );

  const clamp = (p: number) => Math.max(1, Math.min(totalPages, p));
  const canPrev = currentPage > 1 && !isLoading;
  const canNext = currentPage < totalPages && !isLoading;

  // Fallback prefetch (if hook’s getNavHoverPrefetchProps isn’t provided)
  const prefetchFallback = (p: number) => {
    if (!onPrefetch) return;
    const t = clamp(p);
    if (t !== currentPage) onPrefetch(t);
  };

  // Unified helper to get hover/focus/touch handlers
  const navHoverProps = (p: number): HoverPrefetchHandlers => {
    if (getNavHoverPrefetchProps) return getNavHoverPrefetchProps(p);
    return {
      onMouseEnter: () => prefetchFallback(p),
      onFocus: () => prefetchFallback(p),
      onTouchStart: () => prefetchFallback(p),
    };
  };

  const debouncedCurrent = useDebounce(currentPage);

  useEffect(() => {
    if (!onPrefetch) return;
    if (isLoading) return;
    if (totalPages <= 1) return;

    const next = clamp(debouncedCurrent + 1);
    if (next !== debouncedCurrent) {
      onPrefetch(next);
    }
  }, [debouncedCurrent, totalPages, onPrefetch, isLoading]); // NEW

  return (
    <div className="pagination-wrapper">
      <nav aria-label="pagination" className="pagination-nav">
        {/* First */}
        <Button
          className="pagination-icon-btn"
          onClick={() => onPageClicked(1)}
          disabled={!canPrev}
          aria-label="First page"
          {...navHoverProps(1)}
        >
          &laquo;
        </Button>

        {/* Prev */}
        <Button
          className="pagination-icon-btn"
          onClick={() => onPageClicked(clamp(currentPage - 1))}
          disabled={!canPrev}
          aria-label="Previous page"
          {...navHoverProps(currentPage - 1)}
        >
          &lsaquo;
        </Button>

        {/* Page numbers */}
        {pages.map((p: number) => (
          <Button
            key={`p-${p}`}
            onClick={() => onPageClicked(p)}
            className={[
              "pagination-page-btn",
              p === currentPage
                ? "pagination-page-btn--active"
                : "pagination-page-btn--inactive",
            ].join(" ")}
            aria-current={p === currentPage ? "page" : undefined}
            {...navHoverProps(p)}
          >
            {p}
          </Button>
        ))}

        {/* Next */}
        <Button
          className="pagination-icon-btn"
          onClick={() => onPageClicked(clamp(currentPage + 1))}
          disabled={!canNext}
          aria-label="Next page"
          {...navHoverProps(currentPage + 1)}
        >
          &rsaquo;
        </Button>

        {/* Last */}
        <Button
          className="pagination-icon-btn"
          onClick={() => onPageClicked(totalPages)}
          disabled={!canNext}
          aria-label="Last page"
          {...navHoverProps(totalPages)}
        >
          &raquo;
        </Button>
      </nav>

      <div className="flex items-center gap-2 my-2">
        <TextInput
          value={pageInput ?? ""}
          onChange={(e) => setPageInput(e.target.value)}
          placeholder="Go to page…"
        />
        <Button onClick={() => onPageClicked(Number(pageInput))}>Go</Button>
      </div>
      <div className="text-sm text-secondary">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
