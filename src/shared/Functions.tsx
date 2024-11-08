import i18next from "i18next";
import { DateTime } from "luxon";

export function getCurrentDate()
{
  return DateTime.now();
}

export function parseDate(dateString: string)
{
  return parseLuxon(dateString).toLocaleString(DateTime.DATE_SHORT);
}

export function parseLuxon(dateString: string)
{
  const locale = i18next.language;
  return DateTime.fromISO(dateString, { locale });
}

export function parseDateOnlyTime(dateString: string)
{
  return parseLuxon(dateString).toLocaleString(DateTime.TIME_24_SIMPLE);
}

export function parseSecondsToMMSS(seconds: number|string) {
  const duration = DateTime.fromSeconds(Number(seconds)).toUTC();
  const oneHour = 3600
  if (Number(seconds) < oneHour) {
    return duration.toFormat("mm:ss");
  } else {
    return duration.toFormat("HH:mm:ss");
  }
}