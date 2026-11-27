import { useContext, useMemo } from "react"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { NowContext } from "../../../../../../../shared/context.ts"
import IndividualResult from "../../../../../components/ResultsList/IndividualResult/IndividualResult.tsx"
import IndividualResultColumnResultTimeAndDiff from "../../../../../components/ResultsList/IndividualResultColumnResultTimeAndDiff/IndividualResultColumnResultTimeAndDiff.tsx"
import OnlineCourse from "../../../../FootO/pages/Results/components/FootOResultRow/components/OnlineCourse/OnlineCourse.tsx"
import { buildLegOnlineCourse } from "../../../shared/relayOnlineCourse.ts"

interface RelayLegRunnerRowProps {
  bestOnlineCumulativeSeconds: ReadonlyArray<number | null> | null
  isClass: boolean
  runner: ProcessedRunnerModel
  teamNamesByRunnerId: ReadonlyMap<string, string>
}

/**
 * Result row of one leg runner, laid out like an individual result: leg position, the runner with
 * their team below, the leg time and the gap at the right, and the online course of the leg under
 * the row.
 *
 * @param props.bestOnlineCumulativeSeconds Best leg time at every online split of this leg, or
 * `null` when there is nothing to compare with, as in club view.
 * @param props.isClass Whether the list is of a class, not of a club.
 * @param props.runner Runner of the leg, seen as a runner of the team's class.
 * @param props.teamNamesByRunnerId Team name by the id of each leg runner; the club is shown when
 * the runner has no team there.
 */
export default function RelayLegRunnerRow({
  bestOnlineCumulativeSeconds,
  isClass,
  runner,
  teamNamesByRunnerId,
}: RelayLegRunnerRowProps) {
  const now = useContext(NowContext)
  const onlineCourse = useMemo(
    () => buildLegOnlineCourse(runner, bestOnlineCumulativeSeconds, now),
    [runner, bestOnlineCumulativeSeconds, now],
  )

  return (
    <IndividualResult
      details={onlineCourse && <OnlineCourse course={onlineCourse} />}
      isClass={isClass}
      ResultColumn={IndividualResultColumnResultTimeAndDiff}
      runner={runner}
      subtitle={teamNamesByRunnerId.get(runner.id)}
    />
  )
}
