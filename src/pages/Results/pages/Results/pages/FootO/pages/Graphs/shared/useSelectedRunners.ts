import { useEffect, useState } from "react"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  parseStoredRunnerIds,
  pickDefaultSelectedRunnerIds,
  SELECTED_RUNNERS_STORAGE_KEY,
} from "./selectedRunners.ts"

export function useSelectedRunners(
  runners: ProcessedRunnerModel[],
): [string[], (runnerIds: string[]) => void] {
  const [selectedRunnerIds, setSelectedRunnerIds] = useState<string[]>([])

  useEffect(() => {
    setSelectedRunnerIds(parseStoredRunnerIds(localStorage.getItem(SELECTED_RUNNERS_STORAGE_KEY)))
  }, [])

  useEffect(() => {
    if (runners.length > 0 && selectedRunnerIds.length === 0) {
      setSelectedRunnerIds(pickDefaultSelectedRunnerIds(runners))
    }
  }, [runners, selectedRunnerIds.length])

  useEffect(() => {
    if (selectedRunnerIds.length > 0) {
      localStorage.setItem(SELECTED_RUNNERS_STORAGE_KEY, JSON.stringify(selectedRunnerIds))
    }
  }, [selectedRunnerIds])

  return [selectedRunnerIds, setSelectedRunnerIds]
}
