/**
 * Formats an ISO date string into a localized, human-readable date string.
 *
 * Uses the browser's `toLocaleDateString` method with options to display the
 * full year, abbreviated month name, and day of the month. The locale is left
 * as `undefined`, allowing the runtime environment to automatically determine
 * the appropriate formatting based on the user's settings.
 *
 * @param dateString - An ISO date string or any string accepted by the `Date` constructor.
 * @returns A localized string representing the formatted date (e.g., "Sep 17, 2025").
 */
export const formatLocalDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
