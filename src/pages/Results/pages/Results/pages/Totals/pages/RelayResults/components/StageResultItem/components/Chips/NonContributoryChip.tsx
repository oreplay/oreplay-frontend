import { Chip } from "@mui/material"
import { useTranslation } from "react-i18next"

export default function NonContributoryChip() {
  const { t } = useTranslation()

  return (
    <Chip
      label={t("ResultsStage.NonContributory")}
      variant={"outlined"}
      color={"default"}
      sx={{
        fontSize: "0.65rem",
        color: "text.disabled",
        height: 18,
        "& .MuiChip-label": {
          px: 0.6,
          py: 0,
        },
      }}
    />
  )
}
