import { API_BASE_URL } from "../../../../../../../services/ApiConfig.ts"

/**
 * Address of the stream that signals each change to the punches of a control.
 * @param stageId Identifier of the stage.
 * @param station Code of the control.
 * @returns The absolute URL of the control's live channel.
 */
export function getControlLiveUrl(stageId: string, station: number) {
  return `${API_BASE_URL}live/stages/${stageId}/controls/${station}`
}
