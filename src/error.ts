import type { AxiosError } from "axios";

export type GithubSearchErrorCode =
  | "AUTH_REQUIRED"
  | "RATE_LIMITED"
  | "VALIDATION"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "SERVER"
  | "NETWORK"
  | "UNKNOWN";

function isRateLimited(ax: any) {
  const status = ax?.response?.status;
  const msg = (ax?.response?.data?.message ?? "").toLowerCase();

  // GitHub core/secondary rate limits
  if (status === 403 || status === 429) {
    if (/rate limit exceeded|abuse detection|secondary rate limit/i.test(msg)) {
      return true;
    }
  }

  const rem = Number((ax?.response?.headers || {})["x-ratelimit-remaining"]);
  return Number.isFinite(rem) && rem <= 0;
}

export class GithubSearchError extends Error {
  name = "GithubSearchError";
  code: GithubSearchErrorCode;
  status?: number;

  /** The raw GitHub message */
  serverMessage?: string;

  /** Docs link from GitHub payload, if present */
  documentation_url?: string;

  /** Helpful rate limit fields (optional but handy) */
  isRateLimit?: boolean;
  rateLimitLimit?: number;
  rateLimitRemaining?: number;
  rateLimitReset?: number; // epoch seconds

  /** Keep the original AxiosError for debugging if needed */
  cause?: unknown;

  constructor(message: string, code: GithubSearchErrorCode, status?: number) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.code = code;
    this.status = status;
  }

  static fromAxios(err: unknown): GithubSearchError {
    const axiosErr = err as AxiosError<any>;
    const status = axiosErr?.response?.status;
    const data = axiosErr?.response?.data as
      | { message?: string; documentation_url?: string }
      | undefined;
    const ghMsg = data?.message || axiosErr?.message || "GitHub Search error";

    // Network / no HTTP response at all
    if (!status) {
      const e = new GithubSearchError("Network error", "NETWORK");
      e.serverMessage = ghMsg;
      e.cause = err;
      return e;
    }

    let code: GithubSearchErrorCode;
    if (status === 401) code = "AUTH_REQUIRED";
    else if (status === 404) code = "NOT_FOUND";
    else if (status === 422) code = "VALIDATION";
    else if (status >= 500) code = "SERVER";
    else if (status === 403 || status === 429) {
      code = isRateLimited(axiosErr) ? "RATE_LIMITED" : "FORBIDDEN";
    } else {
      code = "UNKNOWN";
    }

    const e = new GithubSearchError(ghMsg, code, status);
    e.serverMessage = ghMsg;
    e.documentation_url = data?.documentation_url;
    e.cause = err;

    const h = axiosErr.response?.headers ?? {};
    e.rateLimitLimit = strNum(h["x-ratelimit-limit"]) ?? undefined;
    e.rateLimitRemaining = strNum(h["x-ratelimit-remaining"]) ?? undefined;
    e.rateLimitReset = strNum(h["x-ratelimit-reset"]) ?? undefined;
    e.isRateLimit = code === "RATE_LIMITED";

    return e;
  }
}

function strNum(v: unknown): number | null {
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
