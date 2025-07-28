import i18next from "i18next"
import { DateTime, Duration } from "luxon"

export function parseDate(dateString: string) {
  return parseLuxon(dateString).toLocaleString(DateTime.DATE_SHORT)
}

export function parseLuxon(dateString: string) {
  const locale = i18next.language
  return DateTime.fromISO(dateString, { locale })
}

export function parseDateOnlyTime(dateString: string) {
  return parseLuxon(dateString).toLocaleString(DateTime.TIME_24_SIMPLE)
}

export function parseStartTime(dateString: null | string) {
  if (dateString) {
    return parseLuxon(dateString).toFormat("HH:mm:ss")
  } else return null
}

/**
 * Parse a duration in seconds to MM:SS or HH:MM:SS format
 *
 * @param seconds Duration in seconds
 */
export function parseSecondsToMMSS(seconds: number | string): string {
  // Parse duration
  seconds = Number(seconds)
  const duration = Duration.fromObject({ seconds: seconds })

  // Choose HH:MM:SS or MM:SS formats
  const oneHour = 3600
  if (seconds < oneHour) {
    return duration.toFormat("mm:ss")
  } else {
    const durationString = duration.toFormat("hh:mm:ss")

    // Remove leading 0
    if (durationString.at(0) == "0") {
      return durationString.substring(1)
    } else {
      return durationString
    }
  }
}

/**
 * Parse a time in seconds to a +/-mm:ss or +/-hh:mm:ss format
 *
 * @param seconds duration in seconds of the time behind
 */
export function parseTimeBehind(seconds: number | string): string {
  // Parse Seconds
  seconds = Number(seconds)

  // compute sign
  const sign = seconds < 0 ? "-" : "+"

  // Parse duration
  seconds = Math.abs(seconds) // Absolute avoids formating like "1:-24" in parseSecondsToMMSS
  let durationString = parseSecondsToMMSS(seconds)

  // Add + or -
  durationString = sign + durationString

  // Return
  return durationString
}
