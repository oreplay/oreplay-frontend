import { Box, Button, FormControlLabel, Popover, Radio, RadioGroup } from "@mui/material"
import { DateTime } from "luxon"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { DateRangeIcon } from "@mui/x-date-pickers/icons"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"

export type TimeRangeOption =
  | "last_week"
  | "last_month"
  | "last_year"
  | "future"
  | "anytime"
  | "custom"

export interface TimeRangeValue {
  option: TimeRangeOption
  from?: string // ISO date (yyyy-MM-dd), only used when option === "custom"
  to?: string
}

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_TIME_RANGE: TimeRangeValue = { option: "last_year" }

// Resolves a TimeRangeValue into concrete date bounds relative to "now", using Luxon.
// Maps to GetListEventsParams: `final_date:gte` (window start) and `initial_date:lte` (window end),
// which selects events overlapping the chosen window.
// eslint-disable-next-line react-refresh/only-export-components
export function getDateBounds(value: TimeRangeValue): { after?: string; before?: string } {
  const now = DateTime.now()
  const isoDate = (d: DateTime) => d.toISODate() ?? undefined

  switch (value.option) {
    case "last_week":
      return { after: isoDate(now.minus({ weeks: 1 })), before: isoDate(now) }
    case "last_month":
      return { after: isoDate(now.minus({ months: 1 })), before: isoDate(now) }
    case "last_year":
      return { after: isoDate(now.minus({ years: 1 })), before: isoDate(now) }
    case "future":
      return { after: isoDate(now) }
    case "custom":
      return { after: value.from, before: value.to }
    case "anytime":
    default:
      return {}
  }
}

interface TimeRangeFilterProps {
  value: TimeRangeValue
  onChange: (value: TimeRangeValue) => void
}

/**
 * Resolves a {@link TimeRangeValue} into concrete date bounds relative to "now", using Luxon.
 *
 * Maps to `GetListEventsParams`:
 * - `after` → `final_date:gte` (window start)
 * - `before` → `initial_date:lte` (window end)
 *
 * Together these select events that overlap the chosen window.
 *
 * @param - The selected time range option, plus optional `from`/`to`
 *   ISO date strings (`yyyy-MM-dd`) used only when `option` is `"custom"`.
 * @returns The resolved lower (`after`) and upper
 *   (`before`) ISO date bounds. Both are `undefined` when `option` is `"anytime"`.
 *   Only `after` is set when `option` is `"future"`.
 */
export default function TimeRangeFilter({ value, onChange }: TimeRangeFilterProps) {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [draft, setDraft] = useState<TimeRangeValue>(value)
  const open = Boolean(anchorEl)

  const options: { value: TimeRangeOption; label: string }[] = [
    { value: "last_week", label: t("common:timeFilter.LastWeek") },
    { value: "last_month", label: t("common:timeFilter.LastMonth") },
    { value: "last_year", label: t("common:timeFilter.LastYear") },
    { value: "future", label: t("common:timeFilter.Future") },
    { value: "anytime", label: t("common:timeFilter.Anytime") },
    { value: "custom", label: t("common:timeFilter.CustomRange") },
  ]

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDraft(value)
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)
  const handleApply = () => {
    onChange(draft)
    handleClose()
  }

  const labelFor = (v: TimeRangeValue) => options.find((o) => o.value === v.option)?.label ?? ""

  // Parse draft's ISO strings into Luxon DateTimes for the pickers
  const fromDate = draft.from ? DateTime.fromISO(draft.from) : null
  const toDate = draft.to ? DateTime.fromISO(draft.to) : null

  // Validate custom range with Luxon: `from` must not be after `to`
  const customRangeValid =
    draft.option !== "custom" ||
    (!!fromDate && fromDate.isValid && !!toDate && toDate.isValid && fromDate <= toDate)

  const toDateError =
    !!fromDate && !!toDate && toDate.isValid && fromDate.isValid && !customRangeValid

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Button
        variant="outlined"
        color={value.option === DEFAULT_TIME_RANGE.option ? "inherit" : "primary"}
        startIcon={<DateRangeIcon />}
        onClick={handleOpen}
        sx={{
          whiteSpace: "nowrap",
          ...(value.option === DEFAULT_TIME_RANGE.option && {
            color: "text.secondary",
            borderColor: "action.disabled",
          }),
          textTransform: "none",
          fontSize: "0.75rem",
          flexShrink: 0,
          height: 40,
        }}
      >
        {labelFor(value)}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 260 }}>
          <RadioGroup
            value={draft.option}
            onChange={(e) => setDraft((d) => ({ ...d, option: e.target.value as TimeRangeOption }))}
          >
            {options.map((o) => (
              <FormControlLabel key={o.value} value={o.value} control={<Radio />} label={o.label} />
            ))}
          </RadioGroup>

          {draft.option === "custom" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <DatePicker
                label={t("common:timeFilter.From")}
                value={fromDate}
                maxDate={toDate ?? undefined}
                onChange={(newValue) =>
                  setDraft((d) => ({
                    ...d,
                    from:
                      newValue && newValue.isValid
                        ? (newValue.toISODate() ?? undefined)
                        : undefined,
                  }))
                }
                slotProps={{ textField: { size: "small" } }}
              />
              <DatePicker
                label={t("common:timeFilter.To")}
                value={toDate}
                minDate={fromDate ?? undefined}
                onChange={(newValue) =>
                  setDraft((d) => ({
                    ...d,
                    to:
                      newValue && newValue.isValid
                        ? (newValue.toISODate() ?? undefined)
                        : undefined,
                  }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    error: toDateError,
                    helperText: toDateError ? t("common:timeFilter.InvalidRange") : undefined,
                  },
                }}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Button onClick={handleClose} color={"inherit"}>
              {t("common:Cancel")}
            </Button>
            <Button variant="text" onClick={handleApply} disabled={!customRangeValid}>
              {t("common:apply")}
            </Button>
          </Box>
        </Box>
      </Popover>
    </LocalizationProvider>
  )
}
