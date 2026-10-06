import { useState } from "react"
import { Dialog } from "@mui/material"
import { useXmlFilesIntake } from "./shared/useXmlFilesIntake.ts"
import { useXmlUploads } from "./shared/useXmlUploads.ts"
import CancelUploadDialog from "./components/CancelUploadDialog.tsx"
import StageUploadDialogBody from "./components/StageUploadDialogBody.tsx"
import StageUploadDialogTitle from "./components/StageUploadDialogTitle.tsx"
import { uploadPhaseOf } from "./shared/uploadPhase.ts"
import { useLeavePagePrompt } from "./shared/useLeavePagePrompt.ts"

const DIALOG_HEIGHT_FILLING_SCREEN = "calc(100% - 64px)"
const DIALOG_HEIGHT = {
  xs: DIALOG_HEIGHT_FILLING_SCREEN,
  sm: `min(400px, ${DIALOG_HEIGHT_FILLING_SCREEN})`,
}

interface StageUploadDialogProps {
  eventId: string
  onClose: () => void
  stageId: string
  stageName: string
}

export default function StageUploadDialog({
  eventId,
  onClose,
  stageId,
  stageName,
}: StageUploadDialogProps) {
  const [isCloseRequested, setIsCloseRequested] = useState(false)
  const { cancel, clear, entries, isUploading, upload } = useXmlUploads(eventId)
  const phase = uploadPhaseOf(entries, isUploading)
  useLeavePagePrompt(isUploading)

  const handleFiles = useXmlFilesIntake((files) => {
    setIsCloseRequested(false)
    void upload(files, stageId)
  })

  const handleCloseRequest = () => {
    if (isUploading) setIsCloseRequested(true)
    else onClose()
  }

  const handleCancelUpload = () => {
    cancel()
    onClose()
  }

  return (
    <>
      <Dialog
        open
        onClose={handleCloseRequest}
        maxWidth="xl"
        fullWidth
        slotProps={{ paper: { sx: { height: DIALOG_HEIGHT } } }}
      >
        <StageUploadDialogTitle stageName={stageName} onClose={handleCloseRequest} />
        <StageUploadDialogBody
          phase={phase}
          entries={entries}
          onFiles={handleFiles}
          onUploadMore={clear}
        />
      </Dialog>
      <CancelUploadDialog
        open={isCloseRequested && isUploading}
        onKeepUploading={() => setIsCloseRequested(false)}
        onCancelUpload={handleCancelUpload}
      />
    </>
  )
}
