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

export function parseSecondsToMMSS(seconds: number) {
  return DateTime.fromSeconds(seconds).toUTC().toFormat("mm:ss");
}