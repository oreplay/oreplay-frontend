import { useState } from "react"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import { deleteEvent } from "../../../../../services/EventAdminService.ts"
import { useNavigate } from "react-router-dom"
import { EventDetailModel } from "../../../../../../../shared/EntityTypes.ts"
import { useAuth } from "../../../../../../../shared/hooks.ts"

interface DeleteEventButtonProps {
  event: EventDetailModel
}

export default function DeleteEventButton(props: DeleteEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { token } = useAuth()

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(props.event.id, token)
      await navigate("/dashboard")
    } catch (error) {
      alert("An error occurred deleting the event")
      console.log("error in deleting the event ", error)
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => setIsOpen(true)}
      >
        {t("EventAdmin.DeleteEvent")}
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("EventAdmin.Do you want to delete this event?")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("This action cannot be undone")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {t("Cancel")}
          </Button>
          <Button variant="contained" onClick={void handleDeleteEvent} color="error" autoFocus>
            {t("Delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
