import { DialogContent, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { UploadEntry } from "../shared/uploadEntry.ts"
import { UPLOAD_PHASE, UploadPhase } from "../shared/uploadPhase.ts"
import DropArea from "./DropArea.tsx"
import UploadResultBox from "./UploadResultBox.tsx"

interface StageUploadDialogBodyProps {
  entries: UploadEntry[]
  onFiles: (files: File[]) => void
  onUploadMore: () => void
  phase: UploadPhase
}

export default function StageUploadDialogBody({
  entries,
  onFiles,
  onUploadMore,
  phase,
}: StageUploadDialogBodyProps) {
  const { t } = useTranslation()

  return (
    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography component="p" variant="body2" color="text.secondary">
        {t("EventAdmin.DataUpload.uploadFilesDescription")}
      </Typography>
      {phase === UPLOAD_PHASE.selecting ? (
        <DropArea onFiles={onFiles} />
      ) : (
        <UploadResultBox
          entries={entries}
          isFinished={phase === UPLOAD_PHASE.finished}
          onUploadMore={onUploadMore}
        />
      )}
    </DialogContent>
  )
}
