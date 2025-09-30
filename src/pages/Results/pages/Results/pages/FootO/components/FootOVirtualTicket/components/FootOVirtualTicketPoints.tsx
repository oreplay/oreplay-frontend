import { Grid, Typography } from "@mui/material"
import ExperimentalFeautureIcon from "../../../../../../../../../components/ExperimentalFeautureIcon"
import { useTranslation } from "react-i18next"
import HelpMessageIcon from "../../../../../../../../../components/HelpMessageIcon/HelpMessageIcon.tsx"

export default function FootOVirtualTicketPoints({ points }: { points: number }) {
  const { t } = useTranslation()

  return (
    <Grid item xs={12}>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          gap: 0,
          fontSize: "small",
        }}
      >
        <ExperimentalFeautureIcon />
        <HelpMessageIcon msg={t("ResultsStage.VirtualTicket.FootO.Points.HelpMsg")} />
        <Typography component={"span"} sx={{ fontWeight: "bold", fontSize: "inherit" }}>
          {t("ResultsStage.Points")}
        </Typography>
        <Typography component={"span"} sx={{ fontSize: "inherit", marginLeft: 1 }}>
          {points}
        </Typography>
      </Typography>
    </Grid>
  )
}
