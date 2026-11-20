import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { useCallback, useState } from "react"
import MenuItem from "@mui/material/MenuItem"

interface Props {
  icon: JSX.Element
  menuText: string
  action: () => void | Promise<void>
  menuCloseAction: () => void
  dialogTitle: string
  dialogBody: string
  dialogCancelButtonText: string
  dialogConfirmButtonText: string
  dialogConfirmButtonColor?: ButtonProps["color"]
  disabled?: boolean
}

/**
 * Settings menu entry that asks for confirmation in a dialog before running its action.
 * @param props.icon Icon shown before the menu text.
 * @param props.menuText Label of the menu entry.
 * @param props.action Runs when the dialog is confirmed. When it returns a promise, the dialog stays
 * open with a spinner in the confirm button until the promise settles.
 * @param props.menuCloseAction Closes the parent menu when the dialog is cancelled.
 * @param props.dialogTitle Title of the confirmation dialog.
 * @param props.dialogBody Explanation shown in the confirmation dialog.
 * @param props.dialogCancelButtonText Label of the button that dismisses the dialog.
 * @param props.dialogConfirmButtonText Label of the button that confirms the action.
 * @param props.dialogConfirmButtonColor Colour of the confirm button; red (`error`) when absent, as
 * most entries are destructive.
 * @param props.disabled Greys the entry out so the dialog cannot be opened; enabled when absent.
 */
export default function GridActionsSettingsMenuDialogItem(props: Props) {
  // Internal states
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isConfirming, setIsConfirming] = useState<boolean>(false)

  // handle functions
  const handleClose = useCallback(() => {
    setIsDialogOpen(false)
  }, [])
  const handleOpen = useCallback(() => {
    setIsDialogOpen(true)
  }, [])

  /**
   * Runs the action and closes the dialog once it has finished, showing the pending state meanwhile.
   */
  const handleConfirm = async () => {
    setIsConfirming(true)
    await props.action()
    setIsConfirming(false)
    handleClose()
  }

  // Component
  return (
    <>
      <MenuItem onClick={handleOpen} disabled={props.disabled}>
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText>{props.menuText}</ListItemText>
      </MenuItem>
      <Dialog open={isDialogOpen}>
        <DialogTitle id="alert-dialog-title">{props.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.dialogBody}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            disabled={isConfirming}
            onClick={() => {
              handleClose()
              props.menuCloseAction()
            }}
          >
            {props.dialogCancelButtonText}
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleConfirm()}
            color={props.dialogConfirmButtonColor ?? "error"}
            loading={isConfirming}
            autoFocus
          >
            {props.dialogConfirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
