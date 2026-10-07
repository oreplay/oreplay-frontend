import { Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

export default function NoRunnerWithSplitsMsg() {
  const { t } = useTranslation()

  return (
    <Typography
      sx={{
        fontSize: "big",
        textAlign: "center",
        marginY: "2em",
      }}
    >
      {t("ResultsStage.SplitsTable.NoRunnersWithSplits")}
    </Typography>
  )
}
