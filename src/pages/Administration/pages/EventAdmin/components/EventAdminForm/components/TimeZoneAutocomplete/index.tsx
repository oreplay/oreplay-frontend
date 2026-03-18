import { Autocomplete, Box, TextField, Typography } from "@mui/material"
import { TIMEZONES } from "./timezones.ts"
import { timeZoneOptionGenerator } from "./functions.ts"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

interface TimezoneAutocompleteProps {
  value: TimezoneOption
  onChange: (value: TimezoneOption) => void
  disabled?: boolean
}

export type TimeZoneId = string

export interface TimezoneOption {
  id: TimeZoneId
  city: string
  region: string
  offset: string
  label: string
}

/**
 * Timezone autocomplete helper component.
 * @param value Value controlled by the form
 * @param onChange Form onChange controller
 * @param disabled Field should be disabled or editable?
 */
export default function TimezoneAutocomplete({
  value,
  onChange,
  disabled,
}: TimezoneAutocompleteProps) {
  const { t, i18n } = useTranslation()

  const options = useMemo<TimezoneOption[]>(() => {
    return TIMEZONES.map((tz) => timeZoneOptionGenerator(tz, i18n.language))
  }, [i18n])

  return (
    <Autocomplete
      options={options}
      value={value}
      groupBy={(option) => t(`WorldContinents.${option.region}`)}
      disabled={disabled}
      disableClearable
      fullWidth
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={(option) => option.city}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} />}
      renderOption={(props, option) => (
        <li {...props}>
          <Box>
            <Typography variant="body1">{option.city}</Typography>
            <Typography variant="caption" color="text.secondary">
              {option.offset} — {option.label}
            </Typography>
          </Box>
        </li>
      )}
    />
  )
}
