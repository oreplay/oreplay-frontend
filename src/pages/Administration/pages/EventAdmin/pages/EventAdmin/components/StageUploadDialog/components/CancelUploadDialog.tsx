import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { useTranslation } from "react-i18next"

interface CancelUploadDialogProps {
  onCancelUpload: () => void
  onKeepUploading: () => void
  open: boolean
}

export default function CancelUploadDialog({
  onCancelUpload,
  onKeepUploading,
  open,
}: CancelUploadDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onKeepUploading} aria-labelledby="cancel-upload-title">
      <DialogTitle id="cancel-upload-title">
        {t("EventAdmin.DataUpload.cancelUpload.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{t("EventAdmin.DataUpload.cancelUpload.body")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onKeepUploading} autoFocus>
          {t("EventAdmin.DataUpload.cancelUpload.keepUploading")}
        </Button>
        <Button
          variant="contained"
          color="error"
          data-testid="cancel-upload-confirm"
          onClick={onCancelUpload}
        >
          {t("EventAdmin.DataUpload.cancelUpload.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
