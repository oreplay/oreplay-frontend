import { useGetListControlPunches } from "../../../../../../../infrastructure/repositories/control-punches/control-punches.ts"
import { useControlChanges } from "./useControlChanges.ts"

const PUNCHES_PAGE_SIZE = "50"

/**
 * Options of the punches query: it reloads when the server signals a change and from the refresh
 * button. A number of milliseconds as `refetchInterval` adds polling on top.
 */
const PUNCHES_QUERY_OPTIONS: { refetchInterval: number | false } = { refetchInterval: false }

/**
 * Latest page of punches at a control of a stage, newest first, reloaded every time the control's
 * punches change.
 * @param eventId Identifier of the event.
 * @param stageId Identifier of the stage.
 * @param station Code of the control.
 * @returns The query of the latest page of punches; its `refetch` reloads it.
 */
export function useControlPunches(eventId: string, stageId: string, station: number) {
  const punchesQuery = useGetListControlPunches(
    eventId,
    stageId,
    station,
    { limit: PUNCHES_PAGE_SIZE },
    { query: PUNCHES_QUERY_OPTIONS },
  )
  useControlChanges(stageId, station, punchesQuery.refetch)

  return punchesQuery
}
