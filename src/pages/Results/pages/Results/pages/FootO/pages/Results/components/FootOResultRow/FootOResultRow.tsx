import { useMemo } from "react"
import { runnerService } from "../../../../../../../../../../domain/services/RunnerService.ts"
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import IndividualResultColumnResultTimeAndDiff from "../../../../../../components/ResultsList/IndividualResultColumnResultTimeAndDiff/IndividualResultColumnResultTimeAndDiff.tsx"
import IndividualOrTeamResult from "../../../../../../components/ResultsList/IndividualOrTeamResult/IndividualOrTeamResult.tsx"
import buildOnlineCourse from "../../shared/onlineCourse/buildOnlineCourse.ts"
import hasOnlineControls from "../../shared/onlineCourse/hasOnlineControls.ts"
import OnlineCourse from "./components/OnlineCourse/OnlineCourse.tsx"

export interface FootOResultRowProps {
  runner: ProcessedRunnerModel
  onClick: (runner: ProcessedRunnerModel) => void
  isClass: boolean
  bestOnlineCumulativeSeconds: ReadonlyArray<number | null> | null
}
export default function FootOResultRow({
  runner,
  onClick,
  isClass,
  bestOnlineCumulativeSeconds,
}: FootOResultRowProps) {
  const onlineCourse = useMemo(
    () =>
      hasOnlineControls(runner)
        ? buildOnlineCourse(runner, bestOnlineCumulativeSeconds, runnerService.hasStarted(runner))
        : null,
    [runner, bestOnlineCumulativeSeconds],
  )

  return (
    <IndividualOrTeamResult
      runner={runner}
      isClass={isClass}
      onClick={onClick}
      ResultColumn={IndividualResultColumnResultTimeAndDiff}
      details={onlineCourse && <OnlineCourse course={onlineCourse} />}
    />
  )
}
