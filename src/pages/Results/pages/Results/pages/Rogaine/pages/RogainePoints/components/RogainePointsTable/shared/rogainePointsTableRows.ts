import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getUniqueStationNumbers } from "../../../../../shared/functions.ts"

export type RogainePointsTableRow = {
  punchedStations: readonly bigint[]
  runner: ProcessedRunnerModel
}

/**
 * Rows of the rogaine points table, one per runner, each with the stations the runner punched.
 *
 * @param runners Runners of the class, in the order they are shown.
 * @returns One row per runner, in the same order.
 */
export function buildRogainePointsTableRows(
  runners: readonly ProcessedRunnerModel[],
): RogainePointsTableRow[] {
  return runners.map((runner) => ({ punchedStations: getUniqueStationNumbers([runner]), runner }))
}

/**
 * Key that identifies a row of the rogaine points table among its siblings.
 *
 * @param row The row to identify.
 * @returns The id of the row's runner.
 */
export function getRogainePointsTableRowKey(row: RogainePointsTableRow): string {
  return row.runner.id
}

/**
 * Whether the runner of a row punched a given control.
 *
 * @param row The row of the runner.
 * @param station Station number of the control.
 * @returns `true` when the runner has a punch at that station.
 */
export function isStationPunched(row: RogainePointsTableRow, station: bigint): boolean {
  return row.punchedStations.includes(station)
}
