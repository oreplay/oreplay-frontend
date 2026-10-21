import { TextField } from "@mui/material"
import { useTranslation } from "react-i18next"

interface TrailOResultsUrlInputProps {
  value: string
  errors: (string | undefined)[]
  onBlur: () => void
  onChange: (value: string) => void
}

/**
 * Text field of the Trail-O results URL, turned red with its messages when the value is invalid.
 *
 * @param props.value Current text of the field.
 * @param props.errors Validation messages; the field is in error while there is any.
 * @param props.onBlur Called when the field loses focus, to mark it as touched.
 * @param props.onChange Called with the new text on every keystroke.
 */
export default function TrailOResultsUrlInput(props: TrailOResultsUrlInputProps) {
  const { t } = useTranslation()
  const hasError = props.errors.length > 0

  return (
    <TextField
      autoFocus
      fullWidth
      id="externalUrl"
      name="externalUrl"
      type="url"
      autoComplete="url"
      label={t("EventAdmin.Stages.TrailOResultsUrl.Label")}
      placeholder={t("EventAdmin.Stages.TrailOResultsUrl.Placeholder")}
      value={props.value}
      onBlur={props.onBlur}
      onChange={(e) => props.onChange(e.target.value)}
      error={hasError}
      helperText={props.errors.join(" ")}
    />
  )
}
