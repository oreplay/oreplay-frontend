import { DateTime } from "luxon"

/**
 * Format an ISO datetime string as a localized date WITHOUT time
 * (e.g. "27 Jun 2026"), mirroring the host's date-only display. Falls back to
 * the raw input when it can't be parsed, and to "" for empty input.
 */
export function formatDate(iso: string | null | undefined, locale: string): string {
  if (!iso) return ""
  const date = DateTime.fromISO(iso, { locale })
  if (!date.isValid) return iso
  return date.toLocaleString({
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
