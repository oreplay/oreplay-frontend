import { Box, ListItemIcon, ListItemText } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import QueryStatsIcon from "@mui/icons-material/QueryStats"
import { useTranslation } from "react-i18next"
import { Dialog, DialogRef } from "../../../../../../components/Dialog"
import { useRef } from "react"
import ExperimentalFeatureAlert from "../../../../../../../../../../components/ExperimentalFeatureAlert.tsx"

import GridActionStatsTable from "./components/GridActionStatsTable"

interface GridActionStatsProps {
  eventId: string
  stageId: string
  stageName: string
}

export default function GridActionStats({ eventId, stageId, stageName }: GridActionStatsProps) {
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
        title={t("EventAdmin.Stages.Stats.MenuTitle", { stageName: stageName })}
        ref={dialogRef}
        titleIcon={<QueryStatsIcon />}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <ExperimentalFeatureAlert />
          <GridActionStatsTable
            eventId={eventId}
            stageId={stageId}
            active={dialogRef.current?.isOpen}
          />
        </Box>
      </Dialog>
    </>
  )
}
