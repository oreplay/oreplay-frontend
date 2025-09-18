import { SxProps, Theme, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

interface RacePositionSlotProps {
  text: SxProps<Theme>
}

type RacePositionProps = {
  position: number | bigint | null
  isNC?: boolean
  hasDownload?: boolean
  slotProps?: RacePositionSlotProps
}

export default function RacePosition({
  position,
  isNC,
  hasDownload,
  slotProps,
}: RacePositionProps) {
  const { t } = useTranslation()

  if (isNC) {
    return (
      <Typography sx={{ color: "primary.main", textAlign: "end", ...slotProps?.text }}>
        {t("ResultsStage.statusCodes.nc")}
      </Typography>
    )
  } else if (position) {
    const color = hasDownload ? "primary.main" : "text.secondary"

    return (
      <Typography
        sx={{ color: color, textAlign: "end", ...slotProps?.text }}
      >{`${position}.`}</Typography>
    )
  } else {
    return
  }
}
