import "../../../../../../styles/tokens.css"
import "../../../../../../styles/tailwind.css"
import { SxProps, Theme, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { medalForPosition } from "../../shared/medals.ts"
import PositionMedal from "./components/PositionMedal.tsx"

interface RacePositionSlotProps {
  text: SxProps<Theme>
}

type RacePositionProps = {
  position: number | bigint | null
  canWinMedal?: boolean
  isNC?: boolean
  hasDownload?: boolean
  slotProps?: RacePositionSlotProps
}

export default function RacePosition({
  position,
  canWinMedal = false,
  isNC,
  hasDownload,
  slotProps,
}: RacePositionProps) {
  const { t } = useTranslation()
  const medal = medalForPosition(position, canWinMedal)

  if (isNC) {
    return (
      <Typography sx={{ color: "primary.main", textAlign: "end", ...slotProps?.text }}>
        {t("ResultsStage.statusCodes.nc")}
      </Typography>
    )
  } else if (position && medal) {
    return (
      <Typography component="div" sx={{ textAlign: "end", lineHeight: 0, ...slotProps?.text }}>
        <PositionMedal medal={medal} position={position} />
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
