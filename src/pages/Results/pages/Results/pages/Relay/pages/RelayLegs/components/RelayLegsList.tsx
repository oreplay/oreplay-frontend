import { memo, useMemo, useState } from "react"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import RunnerSorter from "../../../../../components/RunnerSorter/RunnerSorter.tsx"
import bestOnlineCumulativeSeconds from "../../../../FootO/pages/Results/shared/onlineCourse/bestOnlineCumulativeSeconds.ts"
import { sortFootORunners } from "../../../../FootO/shared/functions.ts"
import { legNumbersOf, legRunnersOf, teamNamesByLegRunnerId } from "../../../shared/relayLegs.ts"
import RelayLegRunnerRow from "./RelayLegRunnerRow.tsx"
import RelayLegSelector from "./RelayLegSelector.tsx"

const FIRST_LEG_NUMBER = 1

const RelayLegRunnerRowMemo = memo(RelayLegRunnerRow)

interface RelayLegsListProps {
  isClass: boolean
  teams: ProcessedRunnerModel[]
}

/**
 * The runners of one leg of the relay, picked with the leg buttons, ranked like individual
 * results: by leg time once finished, and by their online controls while out on the course.
 *
 * @param props.isClass Whether the list is of a class, not of a club.
 * @param props.teams The teams of the class or club, in any order.
 */
export default function RelayLegsList({ isClass, teams }: RelayLegsListProps) {
  const [selectedLegNumber, setSelectedLegNumber] = useState(FIRST_LEG_NUMBER)
  const legNumbers = useMemo(() => legNumbersOf(teams), [teams])
  const legRunners = useMemo(
    () => legRunnersOf(teams, selectedLegNumber),
    [teams, selectedLegNumber],
  )

  const runnerRowProps = useMemo(
    () => ({
      bestOnlineCumulativeSeconds: isClass ? bestOnlineCumulativeSeconds(legRunners) : null,
      isClass,
      teamNamesByRunnerId: teamNamesByLegRunnerId(teams, selectedLegNumber),
    }),
    [isClass, legRunners, teams, selectedLegNumber],
  )

  return (
    <>
      <RelayLegSelector
        legNumbers={legNumbers}
        onSelect={setSelectedLegNumber}
        selectedLegNumber={selectedLegNumber}
      />
      <RunnerSorter
        runnerList={legRunners}
        RunnerRow={RelayLegRunnerRowMemo}
        runnerRowProps={runnerRowProps}
        sortingFunction={sortFootORunners}
      />
    </>
  )
}
