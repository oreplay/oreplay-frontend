import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { TimeLossResults } from "../../../../../shared/timeLossAnalysis.ts"
import { CourseControlModel } from "../shared/footOSplitsTableFunctions.ts"
import { countSplitsTableColumns } from "../shared/splitsTableLayout.ts"
import useColumnWidthSync from "../shared/useColumnWidthSync.ts"
import useSyncedHorizontalScroll from "../shared/useSyncedHorizontalScroll.ts"
import SplitsTableBody from "./SplitsTableBody.tsx"
import SplitsTableHeader from "./SplitsTableHeader.tsx"

type SplitsTableLayoutProps = {
  controlList: ReadonlyArray<CourseControlModel | OnlineControlModel>
  onlyRadios?: boolean
  radiosList: OnlineControlModel[]
  runnerList: ProcessedRunnerModel[]
  showCumulative?: boolean
  timeLossEnabled?: boolean
  timeLossResults: TimeLossResults | null
}

export default function SplitsTableLayout({
  controlList,
  onlyRadios,
  radiosList,
  runnerList,
  showCumulative,
  timeLossEnabled,
  timeLossResults,
}: SplitsTableLayoutProps) {
  const showCleanTime = Boolean(timeLossEnabled && !showCumulative)
  const columnCount = countSplitsTableColumns(controlList.length, showCleanTime)
  const scrollers = useSyncedHorizontalScroll<HTMLDivElement, HTMLDivElement>()
  const columnWidths = useColumnWidthSync<HTMLTableRowElement, HTMLTableColElement>(columnCount)

  return (
    <>
      <SplitsTableHeader
        bodyScrollerRef={scrollers.secondScrollerRef}
        columnCount={columnCount}
        columnsRef={columnWidths.targetColumnsRef}
        controlList={controlList}
        onlyRadios={onlyRadios}
        scrollerRef={scrollers.firstScrollerRef}
        showCleanTime={showCleanTime}
      />
      <SplitsTableBody
        controlList={controlList}
        onlyRadios={onlyRadios}
        radiosList={radiosList}
        runnerList={runnerList}
        scrollerRef={scrollers.secondScrollerRef}
        showCleanTime={showCleanTime}
        showCumulative={showCumulative}
        timeLossEnabled={timeLossEnabled}
        timeLossResults={timeLossResults}
        widthSizerRowRef={columnWidths.sourceRowRef}
      />
    </>
  )
}
