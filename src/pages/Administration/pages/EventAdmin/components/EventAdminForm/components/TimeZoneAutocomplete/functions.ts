import { TimeZoneId, TimezoneOption } from "./index.tsx"

/**
 * Helper function to get the user's timezone from the browser
 */
export function getUserTimeZone(): TimeZoneId {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return "UTC"
  }
}

/**
 * Helper function to compute today's offset for a timezone
 * @param timeZone timezone identifier. For example, "Europe/Madrid"
 */
export function getOffset(timeZone: TimeZoneId): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "shortOffset",
  }).formatToParts(new Date())

  return parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT"
}

/**
 * Helper function to get the localized timezone description
 * @param timeZone timezone identifier. For example, "Europe/Madrid"
 * @param locale locale string. For example "es"
 */
export function getLocalizedName(timeZone: TimeZoneId, locale: string): string {
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    timeZoneName: "long",
  }).formatToParts(new Date())

  return parts.find((p) => p.type === "timeZoneName")?.value ?? timeZone
}

/**
 * Helper function to extract the city of a timezone
 * @param timeZone timezone identifier. For example, "Europe/Madrid"
 */
export function formatCity(timeZone: TimeZoneId): string {
  if (!timeZone.includes("/")) return timeZone

  return timeZone.split("/")[1].replace(/_/g, " ")
}

/**
 * Helper function to extract a timezone option format
 * @param tz timezone identifier. For example, "Europe/Madrid"
 * @param locale locale we want the description on. For example, "es"
 */
export function timeZoneOptionGenerator(tz: string, locale: string): TimezoneOption {
  return {
    id: tz,
    city: formatCity(tz),
    region: tz.includes("/") ? tz.split("/")[0] : "Other",
    offset: getOffset(tz),
    label: getLocalizedName(tz, locale),
  }
}
