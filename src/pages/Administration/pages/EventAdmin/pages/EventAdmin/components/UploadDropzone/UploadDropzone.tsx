import { useState } from "react"
import { Alert, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNotifications } from "@toolpad/core/useNotifications"
import { EventDetailModel } from "../../../../../../../../shared/EntityTypes.ts"
import DropArea from "./components/DropArea.tsx"
import StageSelect from "./components/StageSelect.tsx"
import UploadResultList from "./components/UploadResultList.tsx"
import { NO_STAGE_SELECTED, selectedStageId } from "./shared/stageSelection.ts"
import { useXmlUploads } from "./shared/useXmlUploads.ts"
import { splitXmlFiles } from "./shared/xmlFiles.ts"

interface UploadDropzoneProps {
  eventDetail: EventDetailModel
}

export default function UploadDropzone({ eventDetail }: UploadDropzoneProps) {
  const { t } = useTranslation()
  const notifications = useNotifications()
  const [chosenStageId, setChosenStageId] = useState(NO_STAGE_SELECTED)
  const stageId = selectedStageId(eventDetail.stages, chosenStageId)
  const { entries, isUploading, upload } = useXmlUploads(eventDetail.id)
  const hasStages = eventDetail.stages.length > 0

  const handleFiles = (files: File[]) => {
    const { accepted, rejected } = splitXmlFiles(files)
    if (rejected.length > 0) {
      notifications.show(t("EventAdmin.DataUpload.filesIgnored", { count: rejected.length }), {
        autoHideDuration: 5000,
        severity: "warning",
      })
    }
    if (accepted.length > 0) void upload(accepted, stageId)
  }

  return (
    <Stack spacing={2}>
      <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 500 }}>
        {t("EventAdmin.DataUpload.uploadFiles")}
      </Typography>
      <Typography component="p" variant="body2" color="text.secondary">
        {t("EventAdmin.DataUpload.uploadFilesDescription")}
      </Typography>
      {hasStages ? (
        <>
          <StageSelect
            stages={eventDetail.stages}
            value={stageId}
            disabled={isUploading}
            onChange={setChosenStageId}
          />
          <DropArea
            disabled={stageId === NO_STAGE_SELECTED}
            isUploading={isUploading}
            onFiles={handleFiles}
          />
          <UploadResultList entries={entries} />
        </>
      ) : (
        <Alert severity="info">{t("EventAdmin.DataUpload.noStages")}</Alert>
      )}
    </Stack>
  )
}
