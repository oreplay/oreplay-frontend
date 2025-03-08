import { useTranslation } from "react-i18next"
import { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material"
import Tooltip from "@mui/material/Tooltip"
import AddIcon from "@mui/icons-material/Add"
import AutorenewIcon from "@mui/icons-material/Autorenew"
import { CopyToClipBoardButton } from "../../../../../../../shared/Components.tsx"

interface RefreshButtonParams {
  handleRenewToken: () => void
  eventToken: string
  eventId: string
}

export default function RefreshButton(props: RefreshButtonParams) {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const handleClose = () => {
    setIsDialogOpen(false)
  }
  const handleRenewAndClose = () => {
    props.handleRenewToken()
    setIsDialogOpen(false)
  }

  return (
    <>
      {props.eventToken == "" ? (
        <IconButton>
          <Tooltip title={t("EventAdmin.Create security keys")}>
            <AddIcon onClick={() => props.handleRenewToken()} />
          </Tooltip>
        </IconButton>
      ) : (
        <>
          <IconButton>
            <Tooltip title={t("EventAdmin.Renew security keys")}>
              <AutorenewIcon onClick={() => setIsDialogOpen(true)} />
            </Tooltip>
          </IconButton>
          <CopyToClipBoardButton value={`${props.eventId}${props.eventToken}`} />
        </>
      )}
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          {t("EventAdmin.Do you want to renew the security key?")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("EventAdmin.RenewEventTokenMsg")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {t("Cancel")}
          </Button>
          <Button variant="contained" onClick={handleRenewAndClose} autoFocus>
            {t("EventAdmin.Renew")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
