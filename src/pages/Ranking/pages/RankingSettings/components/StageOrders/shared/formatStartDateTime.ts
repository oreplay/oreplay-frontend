import { DateTime } from "luxon"

export function formatStartDateTime(iso: string, lang: string): string {
  if (!iso) return ""
  const dt = DateTime.fromISO(iso)
  return dt.isValid ? dt.setLocale(lang).toLocaleString(DateTime.DATETIME_SHORT) : ""
}
