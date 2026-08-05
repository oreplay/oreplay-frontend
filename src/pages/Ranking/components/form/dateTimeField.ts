import { DateTime } from "luxon"

const DATE_FORMAT = "yyyy-MM-dd"
const TIME_FORMAT = "HH:mm"

export function isoToDatePart(iso: string): string {
  if (!iso) return ""
  const dt = DateTime.fromISO(iso)
  return dt.isValid ? dt.toFormat(DATE_FORMAT) : ""
}

export function isoToTimePart(iso: string): string {
  if (!iso) return ""
  const dt = DateTime.fromISO(iso)
  return dt.isValid ? dt.toFormat(TIME_FORMAT) : ""
}

export function combineDateAndTime(date: string, time: string): string {
  if (!date) return ""
  const dt = DateTime.fromISO(`${date}T${time || "00:00"}`)
  return dt.isValid ? (dt.toISO() ?? "") : ""
}

export function withDateChange(date: string, currentIso: string, defaultTime?: string): string {
  const time = isoToTimePart(currentIso) || defaultTime || ""
  return combineDateAndTime(date, time)
}

export function withTimeChange(time: string, currentIso: string): string {
  return combineDateAndTime(isoToDatePart(currentIso), time)
}
