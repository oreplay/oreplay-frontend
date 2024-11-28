import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, ListItemIcon, ListItemText
} from "@mui/material";
import {useCallback, useState} from "react";
import MenuItem from "@mui/material/MenuItem";

interface Props {
  icon: JSX.Element
  menuText: string
  action: ()=>void
  menuCloseAction: ()=>void
  dialogTitle: string
  dialogBody: string
  dialogCancelButtonText: string
  dialogConfirmButtonText: string
}

export default function GridActionsSettingsMenuDialogItem(props:Props) {
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
      <MenuItem onClick={handleOpen}>
        <ListItemIcon>
          {props.icon}
        </ListItemIcon>
        <ListItemText>
          {props.menuText}
        </ListItemText>
      </MenuItem>
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
          <Button variant="outlined" onClick={()=>{handleClose();props.menuCloseAction()}}>
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