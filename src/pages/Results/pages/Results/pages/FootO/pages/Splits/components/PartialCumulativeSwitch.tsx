import { Stack, Switch, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

type PartialCumulativeSwitchProps = {
  active: boolean
  setActive: (newValue: (prev: boolean) => boolean) => void
  disabled?: boolean
}

export default function PartialCumulativeSwitch({
  active,
  setActive,
  disabled,
}: PartialCumulativeSwitchProps) {
  const { t } = useTranslation()

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <Typography sx={{ color: disabled ? "text.disabled" : undefined }}>
        {t("ResultsStage.SplitsTable.PartialTimes")}
      </Typography>
      <Switch disabled={disabled} checked={active} onChange={() => setActive((prev) => !prev)} />
      <Typography sx={{ color: disabled ? "text.disabled" : undefined }}>
        {t("ResultsStage.SplitsTable.CumulativeTimes")}
      </Typography>
    </Stack>
  )
}
