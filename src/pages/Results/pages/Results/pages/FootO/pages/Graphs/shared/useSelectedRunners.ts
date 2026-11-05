import { useCallback, useEffect, useRef, useState } from "react"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  isClearedSelection,
  needsDefaultSelection,
  parseStoredRunnerIds,
  pickDefaultSelectedRunnerIds,
  SELECTED_RUNNERS_STORAGE_KEY,
} from "./selectedRunners.ts"

/**
 * Reads the stored runner selection from the browser storage.
 *
 * @returns The stored value, or `null` when there is none or the storage is unavailable (e.g. the
 * browser blocks site data, which makes any access to `localStorage` throw).
 */
function readStoredRunnerIds(): string | null {
  try {
    return localStorage.getItem(SELECTED_RUNNERS_STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * Stores the runner selection in the browser storage. An unavailable storage is ignored, so the
 * selection then lasts only while the page is open.
 *
 * @param runnerIds The selected runner ids.
 */
function writeStoredRunnerIds(runnerIds: string[]) {
  try {
    writeStoredRunnerIds(runnerIds)
  } catch {
    return
  }
}

/**
 * Keeps the runners plotted in the graphs, remembered across visits. When nothing selected belongs
 * to the class on screen the best placed runners are picked, unless the user emptied the selection
 * on purpose, which is remembered across visits too.
 *
 * @param runners Runners of the class.
 * @returns The selected runner ids and the setter used when the user changes them.
 */
export function useSelectedRunners(
  runners: ProcessedRunnerModel[],
): [string[], (runnerIds: string[]) => void] {
  const [storedRunnerIds] = useState(readStoredRunnerIds)
  const [selectedRunnerIds, setSelectedRunnerIds] = useState<string[]>(() =>
    parseStoredRunnerIds(storedRunnerIds),
  )
  const wasClearedByUser = useRef(isClearedSelection(storedRunnerIds))

  useEffect(() => {
    if (!wasClearedByUser.current && needsDefaultSelection(runners, selectedRunnerIds)) {
      setSelectedRunnerIds(pickDefaultSelectedRunnerIds(runners))
    }
  }, [runners, selectedRunnerIds])

  const selectRunners = useCallback((runnerIds: string[]) => {
    wasClearedByUser.current = runnerIds.length === 0
    writeStoredRunnerIds(runnerIds)
    setSelectedRunnerIds(runnerIds)
  }, [])

  return [selectedRunnerIds, selectRunners]
}
