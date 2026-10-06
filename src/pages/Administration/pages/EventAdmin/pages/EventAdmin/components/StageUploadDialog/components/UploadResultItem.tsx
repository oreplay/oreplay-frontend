import { Alert, AlertTitle, Box, CircularProgress, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import {
  messagesOf,
  severityOf,
  statusKeyOf,
  updatedCountsOf,
  UPLOAD_STATUS,
  UploadEntry,
} from "../shared/uploadEntry.ts"

interface UploadResultItemProps {
  entry: UploadEntry
}

export default function UploadResultItem({ entry }: UploadResultItemProps) {
  const { t } = useTranslation()
  const messages = messagesOf(entry)
  const uploadingIcon =
    entry.status === UPLOAD_STATUS.uploading ? <CircularProgress size={20} /> : undefined

  return (
    <Alert
      severity={severityOf(entry)}
      icon={uploadingIcon}
      sx={{ backgroundColor: "transparent", p: 0 }}
    >
      <AlertTitle sx={{ overflowWrap: "anywhere" }}>{entry.fileName}</AlertTitle>
      <Typography variant="body2">{t(statusKeyOf(entry), updatedCountsOf(entry))}</Typography>
      {messages.length > 0 && (
        <Box component="ul" sx={{ m: 0, mt: 1, pl: 2 }}>
          {messages.map((message, index) => (
            <Typography component="li" variant="body2" key={`${message.code}-${index}`}>
              {message.text}
            </Typography>
          ))}
        </Box>
      )}
    </Alert>
  )
}
