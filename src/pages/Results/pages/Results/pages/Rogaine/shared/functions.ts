import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"
import { RunnerModel, SplitModel } from "../../../../../../../shared/EntityTypes.ts"
import { DateTime } from "luxon"

export function getUniqueStationNumbers(runners: ProcessedRunnerModel[]): bigint[] {
  const stationNumbers = new Set<bigint>()

  runners.forEach((runner) => {
    runner.stage.splits.forEach((split) => {
      if (split.control) {
        stationNumbers.add(BigInt(split.control.station))
      }
    })
  })

  // Convert the set to an array and sort in ascending order
  return Array.from(stationNumbers).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
}

const MAX_SPLIT_TIME_DIFFERENCE_SECONDS = 60

/**
 * Copies split (control punch) data from a relay team's individual runners into the
 * team's own main `stage.splits` array. This was created as a workaround because OEScore12
 * only exports splits and runner level, not at team level.
 *
 * For each control that appears in every team runner's splits (matched by `control.id`),
 * a single combined split is created for the team using the **latest** (max) `reading_time`
 * among the runners' matching splits. Controls that are not present in every team runner
 * are skipped. If the matching runners' reading times for a control differ by more than
 * {@link MAX_SPLIT_TIME_DIFFERENCE_SECONDS}, that control is also skipped, since the
 * readings are considered too far apart to represent the same punch event.
 *
 * The resulting splits are sorted by `reading_time` and assigned a fresh `order_number`
 * starting at 1. Computed/statistical fields (`points`) are not copied and are set to `null`.
 *
 * Does nothing if:
 * - `runner` is not a team (per `runnerService.isTeam`), or
 * - `runner.stage.splits` already has entries (existing splits are never overwritten), or
 * - `runner.runners` is empty or missing.
 *
 * @param runner - The team runner model whose `stage.splits` will be populated in place
 *                 based on its individual team members' splits.
 */
export function copySplitsFromRunnerToTeam(runner: RunnerModel): void {
  // Do nothing if it is not a team
  if (!runnerService.isTeam(runner)) {
    return
  }

  // Only fill splits if the main stage doesn't already have some
  if (runner.stage.splits.length > 0) {
    return
  }

  const teamRunners = runner.runners ?? []
  if (teamRunners.length === 0) {
    return
  }

  // Group each team runner's splits by control id
  const splitsByControlId = new Map<string, SplitModel[]>()

  for (const teamRunner of teamRunners) {
    for (const split of teamRunner.stage.splits) {
      const controlId = split.control?.id
      if (!controlId) {
        continue
      }
      if (!splitsByControlId.has(controlId)) {
        splitsByControlId.set(controlId, [])
      }
      splitsByControlId.get(controlId)!.push(split)
    }
  }

  const combinedSplits: SplitModel[] = []

  for (const splits of splitsByControlId.values()) {
    // Skip this control if not every team runner has a matching split for it
    if (splits.length !== teamRunners.length) {
      continue
    }

    // Skip if any of the matching splits has no reading time to compare
    if (splits.some((split) => !split.reading_time)) {
      continue
    }

    const readingTimeMillis = splits.map((split) =>
      DateTime.fromISO(split.reading_time as string).toMillis(),
    )

    // Skip if any reading time failed to parse
    if (readingTimeMillis.some((millis) => Number.isNaN(millis))) {
      continue
    }

    const minMillis = Math.min(...readingTimeMillis)
    const maxMillis = Math.max(...readingTimeMillis)

    // Skip if the readings are too spread out to be considered the same split
    if ((maxMillis - minMillis) / 1000 > MAX_SPLIT_TIME_DIFFERENCE_SECONDS) {
      continue
    }

    const referenceSplit = splits[0]

    combinedSplits.push({
      id: crypto.randomUUID(),
      is_intermediate: referenceSplit.is_intermediate,
      reading_time: DateTime.fromMillis(maxMillis).toISO(),
      order_number: null, // assigned below, after sorting
      points: null,
      control: referenceSplit.control,
    })
  }

  // Sort by reading time and assign order_number from 1 onwards
  combinedSplits.sort(
    (a, b) =>
      DateTime.fromISO(a.reading_time as string).toMillis() -
      DateTime.fromISO(b.reading_time as string).toMillis(),
  )

  combinedSplits.forEach((split, index) => {
    split.order_number = index + 1
  })

  runner.stage.splits = combinedSplits
}
