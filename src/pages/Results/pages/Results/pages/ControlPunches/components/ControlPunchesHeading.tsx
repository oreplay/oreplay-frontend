import { Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

interface ControlPunchesHeadingProps {
  station: number
}

/**
 * Title of the punches screen, naming the control.
 * @param props.station Code of the control.
 */
export default function ControlPunchesHeading({ station }: ControlPunchesHeadingProps) {
  const { t } = useTranslation()

  return (
    <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 600, paddingX: 1 }}>
      {t("ResultsStage.Control", { station })}
    </Typography>
  )
}
