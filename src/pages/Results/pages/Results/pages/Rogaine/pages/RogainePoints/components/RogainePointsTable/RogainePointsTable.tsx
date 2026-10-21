import { useMemo } from "react"
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import NowProvider from "../../../../../../components/NowProvider.tsx"
import RunnerHeading from "../../../../../../components/RunnerHeading.tsx"
import ScrollTable from "../../../../../../components/ScrollTable/ScrollTable.tsx"
import RogainePointsTableCell from "./components/RogainePointsTableCell.tsx"
import RogainePointsTableHeaderCellContent from "./components/RogainePointsTableHeaderCellContent.tsx"
import {
  buildRogainePointsTableColumns,
  getRogainePointsTableColumnKey,
} from "./shared/rogainePointsTableColumns.ts"
import {
  buildRogainePointsTableRows,
  getRogainePointsTableRowKey,
} from "./shared/rogainePointsTableRows.ts"

type RogainePointsTableProps = {
  controlStations: readonly bigint[]
  headerStickyTopPx?: number
  runners: readonly ProcessedRunnerModel[]
}

/**
 * Points of every runner of a rogaine class, in the same scroll table as the foot-O splits: a
 * heading with the runner's position and name above their bonus, penalty, points, time and the
 * controls they punched.
 *
 * @param props.controlStations Station numbers of the class's controls, one column each.
 * @param props.headerStickyTopPx Distance from the top of the viewport where the header sticks.
 * @param props.runners Runners of the class, in the order they are shown.
 */
export default function RogainePointsTable({
  controlStations,
  headerStickyTopPx,
  runners,
}: RogainePointsTableProps) {
  const columns = useMemo(() => buildRogainePointsTableColumns(controlStations), [controlStations])
  const rows = useMemo(() => buildRogainePointsTableRows(runners), [runners])

  return (
    <NowProvider>
      <ScrollTable
        CellContent={RogainePointsTableCell}
        columns={columns}
        getColumnKey={getRogainePointsTableColumnKey}
        getRowKey={getRogainePointsTableRowKey}
        HeaderCellContent={RogainePointsTableHeaderCellContent}
        headerStickyTopPx={headerStickyTopPx}
        RowHeading={RunnerHeading}
        rows={rows}
      />
    </NowProvider>
  )
}
