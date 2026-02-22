import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import MenuItem from "@mui/material/MenuItem"
import { Leaderboard } from "@mui/icons-material"
import { t } from "i18next"
import { ProcessedParticipantModel } from "../../../../../../Results/components/VirtualTicket/shared/EntityTypes.ts"
import { postCreateOrganizer, currentRankingId } from "../../../../../services/RankingHelper.ts"
import { useAuth } from "../../../../../../../shared/hooks.ts"

interface Props {
  //   icon: JSX.Element
  //   menuText: string
  action: () => void
  menuCloseAction: () => void
  //   dialogTitle: string
  //   dialogBody: string
  //   dialogCancelButtonText: string
  //   dialogConfirmButtonText: string
}
const props = {
  icon: <Leaderboard />,
  menuText: "Manage ranking", // t("EventAdmin.Stages.Ranking.MenuText"),
  // action:
  // menuCloseAction:
  dialogTitle: "Manage ranking ", // t("EventAdmin.Stages.Ranking.DialogTitle"),
  dialogBody: currentRankingId(), // t("EventAdmin.Stages.Ranking.DialogBody"),
  dialogCancelButtonText: t("Cancel"),
  dialogConfirmButtonText: t("OK"),
  dialogSendOrganizerButtonText: "Send organizer",
  stageOrderInput: "Stage order",
}

export default function RankingDialogItem(properties: Props) {
  // Internal states
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  // custom handling
  const { token } = useAuth()
  const [stageOrder, setStageOrder] = useState<number>(0)
  const [eventId, setEventId] = useState<string>("")
  const [stageId, setStageId] = useState<string>("")
  const [runner, setRunner] = useState<ProcessedParticipantModel | null>(null)
  useEffect(() => {
    const channel = new BroadcastChannel("user_interaction")
    const handler = (event: MessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { type, payload, path } = event.data || {}
      if (type === "RUNNER_EXPANDED" && path) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
        const [splitEventId, splitStageId] = path.split("/competitions/")[1].split("/")
        setEventId(splitEventId as string)
        setStageId(splitStageId as string)
        const runnerPayload = payload as ProcessedParticipantModel
        if (runnerPayload?.full_name) {
          setRunner(runnerPayload)
        }
      }
    }
    channel.addEventListener("message", handler)
    return () => {
      channel.removeEventListener("message", handler)
      channel.close()
    }
  }, [])

  // handle functions
  const handleClose = useCallback(() => {
    setRunner(null)
    setIsDialogOpen(false)
  }, [])
  const handleOpen = useCallback(() => {
    setIsDialogOpen(true)
  }, [])

  // Component
  return (
    <>
      <MenuItem onClick={handleOpen}>
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText>{props.menuText}</ListItemText>
      </MenuItem>
      <Dialog open={isDialogOpen}>
        <DialogTitle id="alert-dialog-title">{props.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.dialogBody}</DialogContentText>
          {runner && (
            <DialogContentText sx={{ mt: 2, fontWeight: "bold" }}>
              <Card sx={{ p: 2, my: 4, boxShadow: 3, borderRadius: 2 }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {runner.bib_number}: {runner.full_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {runner.id}
                </Typography>
                <TextField
                  type="number"
                  label={props.stageOrderInput}
                  value={stageOrder}
                  onChange={(e) => setStageOrder(Number(e.target.value))}
                  sx={{ mt: 2, mb: 2 }}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    void postCreateOrganizer(
                      eventId,
                      stageId,
                      runner.id,
                      stageOrder,
                      token as string,
                    )
                    handleClose()
                    setTimeout(handleOpen, 400)
                  }}
                  color="primary"
                  autoFocus
                  fullWidth
                >
                  {props.dialogSendOrganizerButtonText}
                </Button>
              </Card>
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              handleClose()
              properties.menuCloseAction()
            }}
          >
            {props.dialogCancelButtonText}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              properties.action()
              handleClose()
            }}
            color="error"
            autoFocus
          >
            {props.dialogConfirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
