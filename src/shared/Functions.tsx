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