import { DateTime } from "luxon"
import { parseDate } from "../../../shared/Functions.tsx"

export function formatEventDateRange(initialDate?: string, finalDate?: string): string | null {
  if (!initialDate || !finalDate) {
    return null
  }
  const initial = parseDate(initialDate)
  const final = parseDate(finalDate)
  return initial === final ? initial : `${initial} - ${final}`
}

export function formatStageStart(start: string): string {
  return DateTime.fromISO(start).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
}
