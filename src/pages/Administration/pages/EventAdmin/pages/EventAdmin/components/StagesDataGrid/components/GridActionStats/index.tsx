import { ListItemIcon, ListItemText } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import QueryStatsIcon from "@mui/icons-material/QueryStats"
import { useTranslation } from "react-i18next"
import { Dialog, DialogRef } from "../../../../../../components/Dialog"
import { useRef } from "react"

interface GridActionStatsProps {
  eventId: string
  stageId: string
}

export default function GridActionStats({ eventId, stageId }: GridActionStatsProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<DialogRef>(null)

  return (
    <>
      <MenuItem onClick={() => dialogRef.current?.handleOpen()}>
        <ListItemIcon>
          <QueryStatsIcon />
        </ListItemIcon>
        <ListItemText>{t("EventAdmin.Stages.Stats.MenuText")}</ListItemText>
      </MenuItem>
      <Dialog
        title={t("EventAdmin.Stages.Stats.MenuText")}
        ref={dialogRef}
        titleIcon={<QueryStatsIcon />}
      ></Dialog>
    </>
  )
}
