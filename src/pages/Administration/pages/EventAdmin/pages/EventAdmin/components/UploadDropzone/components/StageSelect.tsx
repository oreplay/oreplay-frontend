import { MenuItem, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"
import { StageModel } from "../../../../../../../../../shared/EntityTypes.ts"

interface StageSelectProps {
  disabled: boolean
  onChange: (stageId: string) => void
  stages: StageModel[]
  value: string
}

export default function StageSelect({ disabled, onChange, stages, value }: StageSelectProps) {
  const { t } = useTranslation()

  return (
    <TextField
      select
      fullWidth
      id="upload-stage"
      label={t("EventAdmin.DataUpload.stage")}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
    >
      {stages.map((stage) => (
        <MenuItem key={stage.id} value={stage.id}>
          {stage.description}
        </MenuItem>
      ))}
    </TextField>
  )
}
