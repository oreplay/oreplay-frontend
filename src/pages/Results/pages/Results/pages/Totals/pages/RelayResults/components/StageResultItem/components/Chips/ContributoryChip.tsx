import { Chip } from "@mui/material"
import { useTranslation } from "react-i18next"

export default function ContributoryChip() {
  const { t } = useTranslation()

  return (
    <Chip
      label={t("ResultsStage.Contributory")}
      variant={"outlined"}
      color={"primary"}
      sx={{
        fontSize: "0.65rem",
        height: 18,
        "& .MuiChip-label": {
          px: 0.6,
          py: 0,
        },
      }}
    />
  )
}
