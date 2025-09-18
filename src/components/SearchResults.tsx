import React from "react";
import SearchItem from "./SearchItem";
import type { SearchResultItem } from "../types/GithubSearchItem";
import Loading from "./common/Loading";
import ErrorText from "./common/ErrorText";
import NoData from "./common/NoData";
import type { SearchResponseGeneric } from "../types/SearchResponseGeneric";

type Props = {
  isLoading: boolean;
  isFetching?: boolean;
  error: Error | null;
  data: SearchResponseGeneric;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  perPage: number;
  sentinelRef?: React.RefObject<HTMLDivElement | null>;
};

const SearchResults: React.FC<Props> = ({ isLoading, error, data }) => {
  if (isLoading) return <Loading />;
  if (error) return <ErrorText message={""} />;
  if (data.total_count === 0) return <NoData />;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        <span className="text-secondary">Total Search Result:</span>
        <span className="text-accent">{data.total_count}</span>
      </div>

      <ul className="divide-y">
        {data.items?.map((item: SearchResultItem) => (
          <li key={item.id} className="py-3">
            <SearchItem
              link={item.html_url}
              title={item.title}
              updatedAt={item.updated_at}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
