import { useState } from "react"
import { ProcessedRunnerModel } from "./EntityTypes"

export function useVirtualTicket(): [
  boolean,
  ProcessedRunnerModel | null,
  (runner: ProcessedRunnerModel, leg?: number) => void,
  () => void,
  number | undefined,
] {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRunner, setSelectedRunner] = useState<ProcessedRunnerModel | null>(null)
  const [selectedLeg, setSelectedLeg] = useState<number | undefined>(undefined)

  const handleRowClick = (runner: ProcessedRunnerModel, leg?: number) => {
    setSelectedRunner(runner)
    setSelectedLeg(leg)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  return [dialogOpen, selectedRunner, handleRowClick, handleCloseDialog, selectedLeg]
}
