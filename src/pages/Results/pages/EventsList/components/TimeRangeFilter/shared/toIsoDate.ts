import { DateTime } from "luxon"

/**
 * Converts a date picker's value into the ISO date stored in a custom time range.
 *
 * @param value - The picked date; `null` when the picker was cleared.
 * @returns The date as `yyyy-MM-dd`, or `undefined` when nothing (or an invalid date) is picked.
 */
export function toIsoDate(value: DateTime | null): string | undefined {
  if (!value?.isValid) return undefined
  return value.toISODate() ?? undefined
}
