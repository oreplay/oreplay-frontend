import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import { CloseConfirmationKeys } from "../shared/closeConfirmation.ts"

interface ConfirmCloseDialogProps {
  keys: CloseConfirmationKeys
  onConfirm: () => void
  onKeep: () => void
  open: boolean
}

/**
 * Asks before closing the upload dialog while files are uploading or a folder is listened to.
 * @param props.keys the translation keys of the wording, see `closeConfirmationKeysOf`.
 * @param props.onConfirm stops sending data and closes.
 * @param props.onKeep dismisses the question and keeps sending data.
 * @param props.open whether the question is shown.
 */
export default function ConfirmCloseDialog({
  keys,
  onConfirm,
  onKeep,
  open,
}: ConfirmCloseDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onKeep} aria-labelledby="confirm-close-title">
      <DialogTitle id="confirm-close-title">{t(keys.title)}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t(keys.body)}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onKeep} autoFocus>
          {t(keys.keep)}
        </Button>
        <Button
          variant="contained"
          color="error"
          data-testid="cancel-upload-confirm"
          onClick={onConfirm}
        >
          {t(keys.confirm)}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
