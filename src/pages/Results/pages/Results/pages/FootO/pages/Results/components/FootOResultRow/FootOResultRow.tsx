import { useContext, useMemo } from "react"
import { runnerService } from "../../../../../../../../../../domain/services/RunnerService.ts"
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { NowContext } from "../../../../../../../../shared/context.ts"
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
  isOnlineCourseVisible: boolean
}

/**
 * Result row of a FootO runner, with the online course of the runner as a second line. The course
 * is rebuilt when the runner crosses their start time, so it goes live without a data refetch.
 *
 * @param props.runner Runner the row is about.
 * @param props.onClick Called with the runner when the row is clicked.
 * @param props.isClass Whether the list is of a class, not of a club.
 * @param props.bestOnlineCumulativeSeconds Best time of the class at each online control, `null`
 * when there is nothing to compare against.
 * @param props.isOnlineCourseVisible Whether the user wants to see the online course. A runner
 * without online controls has none either way.
 */
export default function FootOResultRow({
  runner,
  onClick,
  isClass,
  bestOnlineCumulativeSeconds,
  isOnlineCourseVisible,
}: FootOResultRowProps) {
  const now = useContext(NowContext)
  const hasStarted = runnerService.hasStarted(runner, now)
  const onlineCourse = useMemo(
    () =>
      isOnlineCourseVisible && hasOnlineControls(runner)
        ? buildOnlineCourse(runner, bestOnlineCumulativeSeconds, hasStarted)
        : null,
    [runner, bestOnlineCumulativeSeconds, isOnlineCourseVisible, hasStarted],
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
