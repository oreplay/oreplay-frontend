/**
 * Builds the in-app path of a control's page, where the latest punches at the control are listed.
 * @param eventId Identifier of the event.
 * @param stageId Identifier of the stage.
 * @param station Code of the control.
 * @returns Absolute route path, e.g. `/competitions/<eventId>/<stageId>/control/42`.
 */
export function getControlPath(eventId: string, stageId: string, station: string): string {
  return `${getStagePath(eventId, stageId)}/control/${station}`
}

/**
 * Builds the in-app path of an event's page, where its stages are listed.
 * @param eventId Identifier of the event.
 * @returns Absolute route path, e.g. `/competitions/<eventId>`.
 */
export function getEventPath(eventId: string): string {
  return `/competitions/${eventId}`
}

/**
 * Builds the in-app path of a stage's results page.
 * @param eventId Identifier of the event.
 * @param stageId Identifier of the stage.
 * @returns Absolute route path, e.g. `/competitions/<eventId>/<stageId>`.
 */
export function getStagePath(eventId: string, stageId: string): string {
  return `${getEventPath(eventId)}/${stageId}`
}
