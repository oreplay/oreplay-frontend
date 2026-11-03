import { useState } from "react"
import { Dialog } from "@mui/material"
import { useXmlFilesIntake } from "./shared/useXmlFilesIntake.ts"
import { useXmlUploads } from "./shared/useXmlUploads.ts"
import ConfirmCloseDialog from "./components/ConfirmCloseDialog.tsx"
import FilesUploadPanel from "./components/FilesUploadPanel.tsx"
import FolderListenPanel from "./components/FolderListenPanel/FolderListenPanel.tsx"
import StageUploadDialogBody from "./components/StageUploadDialogBody.tsx"
import StageUploadDialogTitle from "./components/StageUploadDialogTitle.tsx"
import { closeConfirmationKeysOf } from "./shared/closeConfirmation.ts"
import { useFolderListener } from "./shared/useFolderListener.ts"
import { uploadPhaseOf } from "./shared/uploadPhase.ts"
import { UPLOAD_MODE, UploadMode } from "./shared/uploadMode.ts"
import { useLeavePagePrompt } from "./shared/useLeavePagePrompt.ts"

const DIALOG_HEIGHT_FILLING_SCREEN = "calc(100% - 64px)"
const DIALOG_HEIGHT = {
  xs: DIALOG_HEIGHT_FILLING_SCREEN,
  sm: `min(520px, ${DIALOG_HEIGHT_FILLING_SCREEN})`,
}

interface StageUploadDialogProps {
  eventId: string
  onClose: () => void
  stageId: string
  stageName: string
}

/**
 * Sends a stage's start lists and results in IOF XML 3.0, either from files the user picks or by
 * listening to the folder the timing software exports to, like the desktop client.
 * @param props.eventId the event the stage belongs to.
 * @param props.onClose closes the dialog; only called once nothing is being sent.
 * @param props.stageId the stage that receives the data.
 * @param props.stageName the stage's name, shown in the title.
 */
export default function StageUploadDialog({
  eventId,
  onClose,
  stageId,
  stageName,
}: StageUploadDialogProps) {
  const [mode, setMode] = useState<UploadMode>(UPLOAD_MODE.files)
  const [isCloseRequested, setIsCloseRequested] = useState(false)
  const uploads = useXmlUploads(eventId)
  const listener = useFolderListener(eventId, stageId)
  const isSending = uploads.isUploading || listener.isListening
  useLeavePagePrompt(isSending)

  const handleFiles = useXmlFilesIntake((files) => {
    setIsCloseRequested(false)
    void uploads.upload(files, stageId)
  })

  /** Closes straight away, or asks first while data is still being sent. */
  const handleCloseRequest = () => {
    if (isSending) setIsCloseRequested(true)
    else onClose()
  }

  /** Stops every upload and listener, then closes. */
  const handleConfirmClose = () => {
    uploads.cancel()
    listener.stop()
    onClose()
  }

  const panel =
    mode === UPLOAD_MODE.listen ? (
      <FolderListenPanel
        entries={listener.entries}
        folderName={listener.folderName}
        hasFolderError={listener.hasFolderError}
        isSupported={listener.isSupported}
        onStart={() => void listener.start()}
        onStop={listener.stop}
      />
    ) : (
      <FilesUploadPanel
        entries={uploads.entries}
        onFiles={handleFiles}
        onUploadMore={uploads.clear}
        phase={uploadPhaseOf(uploads.entries, uploads.isUploading)}
      />
    )

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
        <StageUploadDialogBody isModeLocked={isSending} mode={mode} onModeChange={setMode}>
          {panel}
        </StageUploadDialogBody>
      </Dialog>
      <ConfirmCloseDialog
        keys={closeConfirmationKeysOf(listener.isListening)}
        open={isCloseRequested && isSending}
        onKeep={() => setIsCloseRequested(false)}
        onConfirm={handleConfirmClose}
      />
    </>
  )
}
