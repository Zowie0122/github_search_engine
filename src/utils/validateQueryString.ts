/**
 * Validates a user-provided search query string against basic rules.
 *
 *  * Rules:
 * - Must not be empty after trimming whitespace.
 * - Must not exceed 256 characters.
 * - May contain at most 5 boolean operators (`AND`, `OR`, `NOT`).
 *
 * @param q - The raw query string provided by the user.
 * @returns A validation error message string if invalid, otherwise `null`.
 */
export const validateQuery = (q: string): string | null => {
  const s = q.trim();
  if (!s) return "Please enter a keyword.";
  if (s.length > 256) return "Query is too long (max 256 characters).";
  const ops = (s.match(/\b(AND|OR|NOT)\b/gi) ?? []).length;
  if (ops > 5) return "Too many boolean operators (max 5).";
  return null;
};
