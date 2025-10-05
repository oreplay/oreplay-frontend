import { forwardRef, ReactNode, useCallback, useImperativeHandle, useState } from "react"
import {
  Box,
  Dialog as MuiDialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

interface DialogProps {
  title: string
  titleIcon?: ReactNode
  children?: ReactNode
}

export interface DialogRef {
  isOpen: boolean
  handleOpen: () => void
  handleClose: () => void
}

export const Dialog = forwardRef<DialogRef, DialogProps>((props: DialogProps, ref) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useImperativeHandle(
    ref,
    () => ({
      isOpen: open,
      handleOpen: handleOpen,
      handleClose: handleClose,
    }),
    [open, handleOpen, handleClose],
  )

  return (
    <MuiDialog open={open} onClose={handleClose} maxWidth={"xl"} fullWidth title={props.title}>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 1 }}>
          {props.titleIcon}
          <Typography variant="h6" component="h3">
            {props.title}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
      <DialogContent>{props.children}</DialogContent>
    </MuiDialog>
  )
})
