import ExportResultsDialog from "../../../../components/ExportResults/ExportResultsDialog.tsx"
import ProcessResultsDialog from "./ProcessResultsDialog.tsx"
import StatsDialog from "./StageStats/StatsDialog.tsx"
import { SourceStageAction } from "./shared/stageOrderActions.ts"

interface SourceStageActionDialogProps {
  action: SourceStageAction
  rankingId: string
  eventId: string
  stageId: string
  onClose: () => void
}

export default function SourceStageActionDialog({
  action,
  rankingId,
  eventId,
  stageId,
  onClose,
}: SourceStageActionDialogProps) {
  if (action === "process") {
    return (
      <ProcessResultsDialog
        open
        rankingId={rankingId}
        eventId={eventId}
        stageId={stageId}
        onClose={onClose}
      />
    )
  }

  if (action === "export") {
    return <ExportResultsDialog open eventId={eventId} stageId={stageId} onClose={onClose} />
  }

  return <StatsDialog open eventId={eventId} stageId={stageId} onClose={onClose} />
}
