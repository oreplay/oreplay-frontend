import {useState} from "react";
import {RunnerModel} from "../../../../shared/EntityTypes.ts";

export function useVirtualTicket():[boolean, RunnerModel|null,(runner:RunnerModel) => void,()=>void] {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRunner, setSelectedRunner] = useState<RunnerModel|null>(null)

  const handleRowClick = (runner: RunnerModel) => {
    setSelectedRunner(runner)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  return [dialogOpen,selectedRunner, handleRowClick, handleCloseDialog]
}