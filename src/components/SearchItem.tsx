import { formatLocalDate } from "../utils/timeDate";
import Link from "./common/Link";

type Props = {
  link: string;
  title?: string;
  updatedAt?: string;
};

export default function SearchItem({ link, title, updatedAt }: Props) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <Link
        to={link}
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap w-32 flex-shrink-0"
      >
        See More Details
      </Link>
      <span className="flex-1 min-w-0 text-secondary break-words">{title}</span>
      {updatedAt && (
        <span className="whitespace-nowrap w-32 flex-shrink-0 text-secondary text-right">
          {formatLocalDate(updatedAt)}
        </span>
      )}
    </div>
  );
}
