import { useEffect, useMemo, useState } from "react";
import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";
import SortDropdown, { type SortOption } from "../components/SortDropdown";
import PaginationNav from "../components/pagination/PaginationNav";
import SearchResults from "../components/SearchResults";
import { ORDER_OPTIONS, SORT_OPTIONS, type Order } from "../constants";
import { validateQuery } from "../utils/validateQueryString";
import ErrorText from "../components/common/ErrorText";
import {
  GITHUB_SEARCH_TYPES,
  QUERY_PER_PAGE_DEFAULT,
  type GithubSearchType,
} from "../services/githubSearchByType";
import {
  LIMIT_RATE_MAX,
  useGithubSearch,
  type UseGithubSearchConfig,
} from "../hooks/apis/useGithubSearch";

const PAGES_TO_SHOW = 5;

type Props = {
  type: GithubSearchType;
  repositoryId?: string;
};

const SearchByQuery: React.FC<Props> = ({ type, repositoryId }) => {
  const [input, setInput] = useState("");
  const [queryString, setQueryString] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<Order>(ORDER_OPTIONS.desc);

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setValidationError(validateQuery(input));
  }, [input]);

  const config = useMemo<UseGithubSearchConfig>(() => {
    const def: UseGithubSearchConfig = {
      type,
      queryString,
      currentPage: page,
      perPage: QUERY_PER_PAGE_DEFAULT,
      sort: sortOrder,
      order: ORDER_OPTIONS.desc,
    };

    switch (type) {
      case GITHUB_SEARCH_TYPES.repositories.value:
        return { ...def, sort: SORT_OPTIONS.stars };

      case GITHUB_SEARCH_TYPES.labels.value:
        return {
          ...def,
          sort: "created",
          ...(repositoryId
            ? { extraParams: { repository_id: repositoryId } }
            : {}),
        };

      default:
        return def;
    }
  }, [type, queryString, sortOrder, page, repositoryId]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    getNavHoverPrefetchProps,
    prefetchPage,
  } = useGithubSearch(config);

  const sortByUpdatedAtOptions: SortOption[] = [
    {
      label: "Latest",
      onClick: () => {
        setPage(1);
        setSortOrder(ORDER_OPTIONS.desc);
      },
    },

    {
      label: "Oldest",
      onClick: () => {
        setPage(1);
        setSortOrder(ORDER_OPTIONS.asc);
      },
    },
  ];

  function onSubmit() {
    if (validationError) return;
    setQueryString(input);
  }

  const totalPages = Math.ceil(
    Math.min(data?.total_count ?? 0, LIMIT_RATE_MAX) / QUERY_PER_PAGE_DEFAULT
  );

  return (
    <div className="page-container">
      <h1 className="mb-4 page-title">
        GitHub <span>{GITHUB_SEARCH_TYPES[type].value}</span> search
      </h1>
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 mb-4">
        <TextInput
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder="Type keyword…"
          className="w-full"
          aria-invalid={!!validationError}
          aria-describedby={validationError ? "search-error" : undefined}
        />

        <Button
          children={"Search"}
          disabled={!!validationError || isLoading}
          onClick={onSubmit}
        />

        {validationError && <ErrorText message={validationError} />}
      </div>

      {data ? (
        <>
          {data.items[0].updated_at && (
            <div className="mb-4 flex justify-end">
              <SortDropdown options={sortByUpdatedAtOptions} />
            </div>
          )}

          <SearchResults
            isLoading={isLoading}
            isFetching={isFetching}
            error={error as any}
            data={data}
            currentPage={page}
            setCurrentPage={setPage}
            perPage={QUERY_PER_PAGE_DEFAULT}
          />

          <PaginationNav
            isLoading={isFetching ?? isLoading}
            currentPage={page}
            totalPages={totalPages}
            onPageClicked={setPage}
            onPrefetch={prefetchPage}
            getNavHoverPrefetchProps={getNavHoverPrefetchProps}
            pageToShow={PAGES_TO_SHOW}
          />
        </>
      ) : error ? (
        <ErrorText message={error.message} />
      ) : null}
    </div>
  );
};

export default SearchByQuery;
