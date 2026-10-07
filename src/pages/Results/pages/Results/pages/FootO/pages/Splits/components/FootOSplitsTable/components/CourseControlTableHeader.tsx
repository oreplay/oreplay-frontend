import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { ControlColumnHeader, isFinishColumnHeader } from "../shared/footOSplitsTableFunctions.ts"

type CourseControlTableHeaderProps = {
  header: ControlColumnHeader
}

export default function CourseControlTableHeader({ header }: CourseControlTableHeaderProps) {
  const { t } = useTranslation()
  const stationLabel = `(${header.station})`

  if (isFinishColumnHeader(header)) {
    return <Typography>{t("ResultsStage.VirtualTicket.FinishControl")}</Typography>
  }

  if (header.isOnlineControl) return <Typography>{stationLabel}</Typography>

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        fontSize: "1rem",
      }}
    >
      <Typography>{header.orderNumber}</Typography>
      <Typography sx={{ fontSize: "0.75rem", color: "#8D8D8D" }}>{stationLabel}</Typography>
    </Box>
  )
}
