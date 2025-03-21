import { Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

type RacePositionProps = {
  position: number | bigint | null
  isNC?: boolean
  hasDownload?: boolean
}

export default function RacePosition({ position, isNC, hasDownload }: RacePositionProps) {
  const { t } = useTranslation()

  if (isNC) {
    return (
      <Typography sx={{ color: "primary.main" }}>{t("ResultsStage.statusCodes.nc")}</Typography>
    )
  } else {
    const color = hasDownload ? "primary.main" : "text.secondary"
    const positionString = position ? `${position}.` : ""

    return <Typography sx={{ color: color }}>{positionString}</Typography>
  }
}
