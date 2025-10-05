import { useRef } from "react"
import { Button } from "@mui/material"
import ShareIcon from "@mui/icons-material/Share"
import { QrCode as QrCodeIcon } from "@mui/icons-material"
import QRCodeSection from "../../../../../../../components/QRCodeSection.tsx"
import { useTranslation } from "react-i18next"
import { Dialog, DialogRef } from "../../../components/Dialog"
interface ShareEventDialogProps {
  eventId: string
  eventName: string
}

export default function ShareEventDialog({ eventId, eventName }: ShareEventDialogProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<DialogRef>(null)

  return (
    <div>
      {/* Button to open dialog */}
      <Button
        variant="outlined"
        startIcon={<ShareIcon />}
        onClick={() => dialogRef.current?.handleOpen()}
      >
        {t("EventAdmin.QRCode.ShareEvent")}
      </Button>

      {/* Dialog */}
      <Dialog ref={dialogRef} title={t("EventAdmin.QRCode.Title")} titleIcon={<QrCodeIcon />}>
        <QRCodeSection eventId={eventId} eventName={eventName} />
      </Dialog>
    </div>
  )
}
