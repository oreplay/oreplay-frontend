/**
 * Format an ISO datetime string as a localized date WITHOUT time
 * (e.g. "27 Jun 2026"), mirroring the host's date-only display. Uses the native
 * Intl API with the active i18n locale. Falls back to the raw input when it
 * can't be parsed, and to "" for empty input.
 */
export function formatDate(iso: string | null | undefined, locale: string): string {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
