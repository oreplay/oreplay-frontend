import { Box, DialogTitle, IconButton, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import { useTranslation } from "react-i18next"

interface StageUploadDialogTitleProps {
  onClose: () => void
  stageName: string
}

export default function StageUploadDialogTitle({
  onClose,
  stageName,
}: StageUploadDialogTitleProps) {
  const { t } = useTranslation()

  return (
    <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center", paddingRight: 4 }}>
        <UploadFileIcon sx={{ marginRight: 1, color: "primary.main" }} />
        <Typography variant="h6" component="h3" sx={{ overflowWrap: "anywhere" }}>
          {t("EventAdmin.DataUpload.titleWithStage", {
            stageName,
            interpolation: { escapeValue: false },
          })}
        </Typography>
      </Box>
      <IconButton
        aria-label={t("common:close")}
        data-testid="stage-upload-close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  )
}
