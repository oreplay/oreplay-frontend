import {GridActionsCellItem} from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import {useCallback, useState} from "react";

interface Props {
  icon: JSX.Element
  iconLabel: string
  tooltipText: string
  action: ()=>void
  dialogTitle: string
  dialogBody: string
  dialogCancelButtonText: string
  dialogConfirmButtonText: string
}

export default function GridActionsCellItemDialog(props:Props) {
  // Internal states
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  // handle functions
  const handleClose = useCallback(
    () => {
      setIsDialogOpen(false)
    }
    ,[])
  const handleOpen = useCallback(
    ()=> {
      setIsDialogOpen(true)
    }
    ,[])

  // Component
  return (
    <>
      <Tooltip title={props.tooltipText}>
        <GridActionsCellItem
          icon={props.icon}
          label={props.iconLabel}
          onClick={handleOpen}
          color={"inherit"}
        />
      </Tooltip>
      <Dialog open={isDialogOpen} >
        <DialogTitle id="alert-dialog-title">
          {props.dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.dialogBody}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {props.dialogCancelButtonText}
          </Button>
          <Button variant="contained"
            onClick={() => {props.action();handleClose()}}
            color='error'
            autoFocus
          >
            {props.dialogConfirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}