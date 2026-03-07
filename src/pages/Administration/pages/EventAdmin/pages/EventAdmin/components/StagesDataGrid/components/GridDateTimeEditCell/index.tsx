import { DateTime } from "luxon"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid"
import { StageRow } from "../../index.tsx"
import { renderTimeViewClock } from "@mui/x-date-pickers"

export function GridLuxonDateTimeEditCell(
  props: GridRenderEditCellParams<StageRow, DateTime | null, string>,
) {
  const { id, field, value } = props
  const apiRef = useGridApiContext()

  const handleChange = (newValue: DateTime | null) => {
    void apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    })
  }

  return (
    <DateTimePicker
      value={value ?? null}
      onChange={handleChange}
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
