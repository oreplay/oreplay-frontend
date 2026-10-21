import { DateTime } from "luxon"

/**
 * Tells whether a custom date range is complete and ordered, so it can be applied as a filter.
 *
 * @param from - Start of the range as an ISO date (`yyyy-MM-dd`); `undefined` when not picked yet.
 * @param to - End of the range as an ISO date (`yyyy-MM-dd`); `undefined` when not picked yet.
 * @returns `true` when both dates are present, valid, and `from` is not after `to` (a single-day
 *   range is valid).
 */
export function isValidCustomRange(from?: string, to?: string): boolean {
  if (!from || !to) return false
  const fromDate = DateTime.fromISO(from)
  const toDate = DateTime.fromISO(to)
  return fromDate.isValid && toDate.isValid && fromDate <= toDate
}
