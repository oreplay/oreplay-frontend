import { useState } from "react"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material"
import ShareIcon from "@mui/icons-material/Share"
import CloseIcon from "@mui/icons-material/Close"
import QRCodeSection from "../../../../../../../components/QRCodeSection.tsx"
import { QrCode as QrCodeIcon } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
interface ShareEventDialogProps {
  eventId: string
  eventName: string
}

export default function ShareEventDialog({ eventId, eventName }: ShareEventDialogProps) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      {/* Button to open dialog */}
      <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleClickOpen}>
        {t("EventAdmin.QRCode.ShareEvent")}
      </Button>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth={"xl"} fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <QrCodeIcon sx={{ marginRight: 1, color: "primary.main" }} />
            <Typography variant="h6" component="h3">
              {t("EventAdmin.QRCode.Title")}
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
        <DialogContent>
          <QRCodeSection eventId={eventId} eventName={eventName} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
