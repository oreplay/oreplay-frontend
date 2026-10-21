import { isStationPunched, RogainePointsTableRow } from "../shared/rogainePointsTableRows.ts"
import { hasRogaineScore } from "../shared/rogainePointsTableRunner.ts"
import ControlBadge from "../../../../../components/ControlBadge.tsx"

type RunnerControlBadgeProps = {
  row: RogainePointsTableRow
  station: bigint
}

/**
 * Badge of one control for a runner, filled when they punched it. Nothing is shown until the
 * runner has a score, so runners still on the course do not look like they missed every control.
 *
 * @param props.row Row of the runner, holding the stations they punched.
 * @param props.station Station number of the control.
 */
export default function RunnerControlBadge({ row, station }: RunnerControlBadgeProps) {
  if (!hasRogaineScore(row.runner)) return null
  return <ControlBadge number={station} punched={isStationPunched(row, station)} />
}
