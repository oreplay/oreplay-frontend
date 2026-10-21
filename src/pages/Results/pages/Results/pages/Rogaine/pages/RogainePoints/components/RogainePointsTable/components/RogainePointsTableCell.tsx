import { ScrollTableCellContentProps } from "../../../../../../../components/ScrollTable/shared/scrollTableProps.ts"
import {
  ROGAINE_POINTS_TABLE_COLUMN_KIND,
  RogainePointsTableColumn,
} from "../shared/rogainePointsTableColumns.ts"
import { RogainePointsTableRow } from "../shared/rogainePointsTableRows.ts"
import { getRogaineScoreLabel } from "../shared/rogainePointsTableRunner.ts"
import RunnerControlBadge from "./RunnerControlBadge.tsx"
import RunnerRaceTime from "./RunnerRaceTime.tsx"

/**
 * Content of a body cell of the rogaine points table, picked by the kind of its column.
 *
 * @param props.column Column of the cell.
 * @param props.row Row of the cell, holding the runner and the stations they punched.
 */
export default function RogainePointsTableCell({
  column,
  row,
}: ScrollTableCellContentProps<RogainePointsTableColumn, RogainePointsTableRow>) {
  if (column.kind === ROGAINE_POINTS_TABLE_COLUMN_KIND.Time) {
    return <RunnerRaceTime runner={row.runner} />
  }
  if (column.kind === ROGAINE_POINTS_TABLE_COLUMN_KIND.Control) {
    return <RunnerControlBadge row={row} station={column.station} />
  }
  return getRogaineScoreLabel(row.runner, column.kind)
}
