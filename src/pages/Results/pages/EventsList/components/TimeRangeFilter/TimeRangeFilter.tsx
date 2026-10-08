import { Box, Button, FormControlLabel, Popover, Radio, RadioGroup, TextField } from "@mui/material"
import { DateTime } from "luxon"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { DateRangeIcon } from "@mui/x-date-pickers/icons"

export type TimeRangeOption = "last_week" | "last_month" | "last_year" | "anytime" | "custom"

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

  // Validate custom range with Luxon: `from` must not be after `to`
  const customRangeValid =
    draft.option !== "custom" ||
    (!!draft.from && !!draft.to && DateTime.fromISO(draft.from) <= DateTime.fromISO(draft.to))

  const toDateError = !!draft.from && !!draft.to && !customRangeValid

  return (
    <>
      <Button
        variant={value.option === DEFAULT_TIME_RANGE.option ? "outlined" : "contained"}
        color={value.option === DEFAULT_TIME_RANGE.option ? "inherit" : "primary"}
        startIcon={<DateRangeIcon />}
        onClick={handleOpen}
        sx={{
          whiteSpace: "nowrap",
          ...(value.option === DEFAULT_TIME_RANGE.option && {
            color: "text.secondary",
            borderColor: "action.disabled",
          }),
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
              <TextField
                label={t("EventList.Filter.From")}
                type="date"
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                value={draft.from ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
              />
              <TextField
                label={t("EventList.Filter.To")}
                type="date"
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                value={draft.to ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
                error={toDateError}
                helperText={toDateError ? t("EventList.Filter.InvalidRange") : undefined}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Button onClick={handleClose}>{t("common:Cancel")}</Button>
            <Button variant="contained" onClick={handleApply} disabled={!customRangeValid}>
              {t("common:apply")}
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  )
}
