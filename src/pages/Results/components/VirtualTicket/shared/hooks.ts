import {useState} from "react";
import {ProcessedRunnerModel} from "./EntityTypes.ts";

export function useVirtualTicket(): [
  boolean,
  ProcessedRunnerModel | null,
  (runner: ProcessedRunnerModel) => void,
  () => void,
  // eslint-disable-next-line
] {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRunner, setSelectedRunner] = useState<ProcessedRunnerModel | null>(null)

  const handleRowClick = (runner: ProcessedRunnerModel) => {
    setSelectedRunner(runner)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  return [dialogOpen,selectedRunner, handleRowClick, handleCloseDialog]
}