import { ACTIVE_CLASS_SEARCH_PARAM } from "../../Results/shared/hooks.ts"

/**
 * Path to the public results page for a competition stage on the host
 * (e.g. `/competitions/<eventId>/<stageId>`). Relative so it resolves to the
 * current host — localhost in dev, oreplay.es in production.
 */
export function competitionResultsPath(eventId: string, stageId: string): string {
  return `/competitions/${eventId}/${stageId}`
}

export function competitionClassResultsPath(
  eventId: string,
  stageId: string,
  className: string,
): string {
  const query = new URLSearchParams({ [ACTIVE_CLASS_SEARCH_PARAM]: className })
  return `${competitionResultsPath(eventId, stageId)}?${query.toString()}`
}
