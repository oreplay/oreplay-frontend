import { Button, Stack, Typography } from "@mui/material"
import SensorsIcon from "@mui/icons-material/Sensors"
import StopCircleIcon from "@mui/icons-material/StopCircle"
import { useTranslation } from "react-i18next"

interface FolderListenStatusProps {
  folderName: string
  onStop: () => void
}

/**
 * States which folder is being listened to and offers to stop.
 * @param props.folderName the name of the folder listened to.
 * @param props.onStop stops listening.
 */
export default function FolderListenStatus({ folderName, onStop }: FolderListenStatusProps) {
  const { t } = useTranslation()

  return (
    <Stack
      direction="row"
      spacing={2}
      useFlexGap
      sx={{
        alignItems: "center",
        borderBottom: "1px solid",
        borderColor: "divider",
        flexWrap: "wrap",
        justifyContent: "space-between",
        pb: 2,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
        <SensorsIcon color="primary" />
        <Typography component="p" variant="body2" role="status" sx={{ overflowWrap: "anywhere" }}>
          {t("EventAdmin.DataUpload.listen.listeningTo", {
            folderName,
            interpolation: { escapeValue: false },
          })}
        </Typography>
      </Stack>
      <Button
        variant="outlined"
        size="small"
        color="error"
        startIcon={<StopCircleIcon />}
        data-testid="folder-listen-stop"
        onClick={onStop}
      >
        {t("EventAdmin.DataUpload.listen.stop")}
      </Button>
    </Stack>
  )
}
