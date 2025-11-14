import { Grid, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import Tooltip from "@mui/material/Tooltip"

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
        <Tooltip title={t("ResultsStage.VirtualTicket.FootO.Points.HelpMsg")}>
          <Typography component={"span"} sx={{ fontWeight: "bold", fontSize: "inherit" }}>
            {t("ResultsStage.Points")}
          </Typography>
        </Tooltip>
        <Typography component={"span"} sx={{ fontSize: "inherit", marginLeft: 1 }}>
          {points}
        </Typography>
      </Typography>
    </Grid>
  )
}
