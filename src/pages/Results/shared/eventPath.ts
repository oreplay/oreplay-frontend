/**
 * Builds the in-app path of an event's page, where its stages are listed.
 * @param eventId Identifier of the event.
 * @returns Absolute route path, e.g. `/competitions/<eventId>`.
 */
export function getEventPath(eventId: string): string {
  return `/competitions/${eventId}`
}
