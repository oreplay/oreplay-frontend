import { useCallback, useEffect, useRef, useState } from "react"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  needsDefaultSelection,
  parseStoredRunnerIds,
  pickDefaultSelectedRunnerIds,
  SELECTED_RUNNERS_STORAGE_KEY,
} from "./selectedRunners.ts"

/**
 * Keeps the runners plotted in the graphs, remembered across visits. When nothing selected belongs
 * to the class on screen the best placed runners are picked, unless the user emptied the selection
 * on purpose.
 *
 * @param runners Runners of the class.
 * @returns The selected runner ids and the setter used when the user changes them.
 */
export function useSelectedRunners(
  runners: ProcessedRunnerModel[],
): [string[], (runnerIds: string[]) => void] {
  const [selectedRunnerIds, setSelectedRunnerIds] = useState<string[]>(() =>
    parseStoredRunnerIds(localStorage.getItem(SELECTED_RUNNERS_STORAGE_KEY)),
  )
  const wasClearedByUser = useRef(false)

  useEffect(() => {
    if (!wasClearedByUser.current && needsDefaultSelection(runners, selectedRunnerIds)) {
      setSelectedRunnerIds(pickDefaultSelectedRunnerIds(runners))
    }
  }, [runners, selectedRunnerIds])

  const selectRunners = useCallback((runnerIds: string[]) => {
    wasClearedByUser.current = runnerIds.length === 0
    localStorage.setItem(SELECTED_RUNNERS_STORAGE_KEY, JSON.stringify(runnerIds))
    setSelectedRunnerIds(runnerIds)
  }, [])

  return [selectedRunnerIds, selectRunners]
}
