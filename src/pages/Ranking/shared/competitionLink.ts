/**
 * Path to the public results page for a competition stage on the host
 * (e.g. `/competitions/<eventId>/<stageId>`). Relative so it resolves to the
 * current host — localhost in dev, oreplay.es in production.
 */
export function competitionResultsPath(eventId: string, stageId: string): string {
  return `/competitions/${eventId}/${stageId}`
}
