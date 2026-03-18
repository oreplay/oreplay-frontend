import { DateTime } from "luxon"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid"
import { StageRow } from "../../index.tsx"
import { renderTimeViewClock } from "@mui/x-date-pickers"
import { TimeZoneId } from "../../../../../../components/EventAdminForm/components/TimeZoneAutocomplete"

interface GridLuxonDateTimeEditCellProps
  extends GridRenderEditCellParams<StageRow, DateTime | null, string> {
  timezone: TimeZoneId
}

export function GridLuxonDateTimeEditCell(props: GridLuxonDateTimeEditCellProps) {
  const { id, field, value, timezone } = props
  const apiRef = useGridApiContext()

  const handleChange = (newValue: DateTime | null) => {
    // Set timezone
    const zoned = newValue?.setZone(timezone, { keepLocalTime: false }) // use event's timezone
    console.log("Timezone for editing zone", timezone)
    // change value on row
    void apiRef.current.setEditCellValue({
      id,
      field,
      value: zoned,
    })
  }

  return (
    <DateTimePicker
      value={value ?? null}
      onChange={handleChange}
      timezone={timezone} // use event's timezone
      slotProps={{
        textField: {
          variant: "outlined",
          fullWidth: true,
        },
      }}
      viewRenderers={{
        hours: renderTimeViewClock,
        minutes: renderTimeViewClock,
      }}
    />
  )
}
