import { Button, Stack, Typography } from "@mui/material"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import { useTranslation } from "react-i18next"
import UploadBox from "../../UploadBox.tsx"

interface FolderListenIdleProps {
  onStart: () => void
}

/**
 * Explains how listening to a folder works and offers to pick one.
 * @param props.onStart asks for a folder and starts listening.
 */
export default function FolderListenIdle({ onStart }: FolderListenIdleProps) {
  const { t } = useTranslation()

  return (
    <UploadBox testId="folder-listen-idle">
      <Stack
        spacing={2}
        sx={{ alignItems: "center", m: "auto", maxWidth: 640, textAlign: "center" }}
      >
        <FolderOpenIcon color="action" fontSize="large" />
        <Typography variant="body2" color="text.secondary">
          {t("EventAdmin.DataUpload.listen.description")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<FolderOpenIcon />}
          data-testid="folder-listen-start"
          onClick={onStart}
        >
          {t("EventAdmin.DataUpload.listen.start")}
        </Button>
      </Stack>
    </UploadBox>
  )
}
