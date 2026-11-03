import { UploadEntry } from "../shared/uploadEntry.ts"
import { UPLOAD_PHASE, UploadPhase } from "../shared/uploadPhase.ts"
import DropArea from "./DropArea.tsx"
import UploadResultBox from "./UploadResultBox.tsx"

interface FilesUploadPanelProps {
  entries: UploadEntry[]
  onFiles: (files: File[]) => void
  onUploadMore: () => void
  phase: UploadPhase
}

/**
 * Uploads files picked by hand: a drop area to choose them, then their progress and results.
 * @param props.entries the files sent so far and how each one went.
 * @param props.onFiles called with the files the user drops or picks.
 * @param props.onUploadMore brings the drop area back once the upload finished.
 * @param props.phase whether the user is choosing files, uploading them or done.
 */
export default function FilesUploadPanel({
  entries,
  onFiles,
  onUploadMore,
  phase,
}: FilesUploadPanelProps) {
  if (phase === UPLOAD_PHASE.selecting) return <DropArea onFiles={onFiles} />

  return (
    <UploadResultBox
      entries={entries}
      isFinished={phase === UPLOAD_PHASE.finished}
      onUploadMore={onUploadMore}
    />
  )
}
