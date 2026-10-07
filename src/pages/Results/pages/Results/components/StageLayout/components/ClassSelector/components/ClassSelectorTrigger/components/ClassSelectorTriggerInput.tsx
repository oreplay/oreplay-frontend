import { FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useTranslation } from "react-i18next"
import { classSelectorLabelKey, ClassSelectorTriggerProps } from "../../../shared/classSelector.ts"

export default function ClassSelectorTriggerInput(props: ClassSelectorTriggerProps) {
  const { t } = useTranslation()
  const label = t(classSelectorLabelKey(props.isClass))
  const hasActiveName = !!props.activeName

  return (
    <FormControl
      sx={{
        maxWidth: 300,
        cursor: "pointer",
      }}
      onClick={props.onClick}
    >
      <InputLabel shrink={hasActiveName}>{label}</InputLabel>
      <OutlinedInput
        readOnly
        notched={hasActiveName}
        value={props.activeName || ""}
        endAdornment={
          <InputAdornment position="end">
            <ExpandMoreIcon />
          </InputAdornment>
        }
        label={label}
        sx={{
          pointerEvents: "none",
        }}
        inputProps={{
          tabIndex: -1,
        }}
      />
    </FormControl>
  )
}
