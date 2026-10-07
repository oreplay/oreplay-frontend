import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  getCourseFromRunner,
  getOnlineControlsCourseFromClassSplits,
} from "./shared/footOSplitsTableFunctions.ts"
import SplitsTableLayout from "./components/SplitsTableLayout.tsx"
import NowProvider from "../../../../../../components/NowProvider.tsx"
import { OnlineControlModel } from "../../../../../../../../../../shared/EntityTypes.ts"
import { hasChipDownload } from "../../../../../../shared/functions.ts"
import NoRunnerWithSplitsMsg from "../../../../components/NoRunnerWithSplitsMsg.tsx"
import { useMemo } from "react"
import { analyzeTimeLoss, TimeLossResults } from "../../../../shared/timeLossAnalysis.ts"
import { runnerService } from "../../../../../../../../../../domain/services/RunnerService.ts"

type FootOSplitsTableProps = {
  runners: ProcessedRunnerModel[]
  onlyRadios?: boolean
  showCumulative?: boolean
  radiosList: OnlineControlModel[]
  timeLossEnabled?: boolean
  timeLossThreshold?: number
}

export default function FootOSplitsTable(props: FootOSplitsTableProps) {
  const runnerList = props.onlyRadios
    ? props.runners.filter((runner) => !runnerService.isDNS(runner))
    : props.runners.filter((runner) => hasChipDownload(runner) && !runnerService.isDNS(runner))

  const onlineControlList = useMemo(
    () => getOnlineControlsCourseFromClassSplits(props.radiosList),
    [props.radiosList],
  )

  const courseControlList = useMemo(() => {
    return getCourseFromRunner(runnerList)
  }, [runnerList])

  const controlList = props.onlyRadios && props.radiosList ? onlineControlList : courseControlList

  const timeLossResults: TimeLossResults | null = useMemo(() => {
    if (!props.timeLossEnabled || props.onlyRadios || !props.timeLossThreshold) {
      return null
    }
    return analyzeTimeLoss(runnerList, props.timeLossThreshold)
  }, [props.timeLossEnabled, props.onlyRadios, props.timeLossThreshold, runnerList])

  if (runnerList.length === 0) {
    return <NoRunnerWithSplitsMsg />
  }

  return (
    <NowProvider>
      <SplitsTableLayout
        controlList={controlList}
        onlyRadios={props.onlyRadios}
        radiosList={props.radiosList}
        runnerList={runnerList}
        showCumulative={props.showCumulative}
        timeLossEnabled={props.timeLossEnabled}
        timeLossResults={timeLossResults}
      />
    </NowProvider>
  )
}
