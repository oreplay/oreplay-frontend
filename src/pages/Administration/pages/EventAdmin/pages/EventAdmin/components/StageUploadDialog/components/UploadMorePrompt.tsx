import { AlertColor, Button, Stack, Typography } from "@mui/material"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import { useTranslation } from "react-i18next"

interface UploadMorePromptProps {
  onUploadMore: () => void
  severity: AlertColor
}

export default function UploadMorePrompt({ onUploadMore, severity }: UploadMorePromptProps) {
  const { t } = useTranslation()

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        borderTop: "1px solid",
        borderColor: `${severity}.light`,
        flexWrap: "wrap",
        justifyContent: "space-between",
        pt: 2,
      }}
    >
      <Typography component="p" variant="body2" color="text.secondary">
        {t("EventAdmin.DataUpload.uploadMore.question")}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        color={severity}
        startIcon={<UploadFileIcon />}
        data-testid="upload-more"
        onClick={onUploadMore}
      >
        {t("EventAdmin.DataUpload.uploadMore.action")}
      </Button>
    </Stack>
  )
}
