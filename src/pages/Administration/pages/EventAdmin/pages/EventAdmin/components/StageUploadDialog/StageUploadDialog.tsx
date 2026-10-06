import { useState } from "react"
import { Dialog, DialogContent, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import DropArea from "./components/DropArea.tsx"
import UploadResultList from "./components/UploadResultList.tsx"
import { useXmlFilesIntake } from "./shared/useXmlFilesIntake.ts"
import { useXmlUploads } from "./shared/useXmlUploads.ts"
import CancelUploadDialog from "./components/CancelUploadDialog.tsx"
import StageUploadDialogTitle from "./components/StageUploadDialogTitle.tsx"
import { useLeavePagePrompt } from "./shared/useLeavePagePrompt.ts"

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
  const { t } = useTranslation()
  const [isCloseRequested, setIsCloseRequested] = useState(false)
  const { cancel, entries, isUploading, upload } = useXmlUploads(eventId)
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
      <Dialog open onClose={handleCloseRequest} maxWidth="xl" fullWidth>
        <StageUploadDialogTitle stageName={stageName} onClose={handleCloseRequest} />
        <DialogContent>
          <Stack spacing={2}>
            <Typography component="p" variant="body2" color="text.secondary">
              {t("EventAdmin.DataUpload.uploadFilesDescription")}
            </Typography>
            <DropArea disabled={false} isUploading={isUploading} onFiles={handleFiles} />
            <UploadResultList entries={entries} />
          </Stack>
        </DialogContent>
      </Dialog>
      <CancelUploadDialog
        open={isCloseRequested && isUploading}
        onKeepUploading={() => setIsCloseRequested(false)}
        onCancelUpload={handleCancelUpload}
      />
    </>
  )
}
