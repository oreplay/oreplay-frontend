import { useMemo } from "react"
import { OnlineControlModel } from "../../../../../../../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import NowProvider from "../../../../../../components/NowProvider.tsx"
import NoRunnerWithSplitsMsg from "../../../../components/NoRunnerWithSplitsMsg.tsx"
import { analyzeTimeLoss } from "../../../../shared/timeLossAnalysis.ts"
import RunnerHeading from "./components/RunnerHeading.tsx"
import ScrollTable from "./components/ScrollTable/ScrollTable.tsx"
import SplitsTableCell from "./components/SplitsTableCell.tsx"
import SplitsTableHeaderCellContent from "./components/SplitsTableHeaderCellContent.tsx"
import {
  getCourseFromRunner,
  getOnlineControlsCourseFromClassSplits,
} from "./shared/footOSplitsTableFunctions.ts"
import { buildSplitsTableColumns, getSplitsTableColumnKey } from "./shared/splitsTableColumns.ts"
import { SplitsTableContentContext } from "./shared/splitsTableContentContext.ts"
import {
  buildSplitsTableRows,
  getSplitsTableRowKey,
  selectRunnersForSplitsTable,
} from "./shared/splitsTableRows.ts"

type FootOSplitsTableProps = {
  runners: ProcessedRunnerModel[]
  onlyRadios?: boolean
  showCumulative?: boolean
  radiosList: OnlineControlModel[]
  timeLossEnabled?: boolean
  timeLossThreshold?: number
}

export default function FootOSplitsTable({
  runners,
  onlyRadios = false,
  showCumulative = false,
  radiosList,
  timeLossEnabled = false,
  timeLossThreshold,
}: FootOSplitsTableProps) {
  const showTimeLoss = timeLossEnabled && !showCumulative

  const runnerList = useMemo(
    () => selectRunnersForSplitsTable(runners, onlyRadios),
    [runners, onlyRadios],
  )

  const controlList = useMemo(
    () =>
      onlyRadios
        ? getOnlineControlsCourseFromClassSplits(radiosList)
        : getCourseFromRunner(runnerList),
    [onlyRadios, radiosList, runnerList],
  )

  const columns = useMemo(
    () => buildSplitsTableColumns(controlList, showTimeLoss),
    [controlList, showTimeLoss],
  )

  const rows = useMemo(
    () => buildSplitsTableRows(runnerList, onlyRadios, radiosList),
    [runnerList, onlyRadios, radiosList],
  )

  const timeLossResults = useMemo(() => {
    if (!timeLossEnabled || onlyRadios || !timeLossThreshold) return null
    return analyzeTimeLoss(runnerList, timeLossThreshold)
  }, [timeLossEnabled, onlyRadios, timeLossThreshold, runnerList])

  const content = useMemo(
    () => ({ showCumulative, showTimeLoss, timeLossResults }),
    [showCumulative, showTimeLoss, timeLossResults],
  )

  if (rows.length === 0) {
    return <NoRunnerWithSplitsMsg />
  }

  return (
    <NowProvider>
      <SplitsTableContentContext.Provider value={content}>
        <ScrollTable
          CellContent={SplitsTableCell}
          columns={columns}
          getColumnKey={getSplitsTableColumnKey}
          getRowKey={getSplitsTableRowKey}
          HeaderCellContent={SplitsTableHeaderCellContent}
          RowHeading={RunnerHeading}
          rows={rows}
        />
      </SplitsTableContentContext.Provider>
    </NowProvider>
  )
}
