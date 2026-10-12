import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getAccessibleColor } from "../../../../../../../../../utils/accessibleColors.ts"
import { RESULT_STATUS } from "../../../../../../../shared/constants.ts"
import { parseResultStatus } from "../../../../../../../shared/sortingFunctions/sortRunners.ts"
import { hasChipDownload } from "../../../../../shared/functions.ts"
import { isSelectableRunner } from "./selectedRunners.ts"

const KNOWN_RESULT_STATUSES: readonly string[] = Object.values(RESULT_STATUS)

export const RUNNER_LIST_ITEM_STATE = {
  Selected: "selected",
  Unavailable: "unavailable",
  Unselected: "unselected",
} as const

export type RunnerListItemState =
  (typeof RUNNER_LIST_ITEM_STATE)[keyof typeof RUNNER_LIST_ITEM_STATE]

export interface RunnerListItem {
  clubName: string | null
  color: string | undefined
  id: string
  name: string
  state: RunnerListItemState
  statusLabelKey: string | null
}

/**
 * Whether every runner that can be plotted is selected.
 *
 * @param items Runners of the list.
 * @returns `false` when no runner can be selected at all.
 */
export function areAllRunnersSelected(items: readonly RunnerListItem[]): boolean {
  const selectableItems = items.filter(isSelectableItem)
  return selectableItems.length > 0 && selectableItems.every(isSelectedItem)
}

/**
 * Builds the entries of the runner list shown next to the graphs: every runner of the class, with
 * the colour its line has in the graph when it is plotted.
 *
 * @param runners Runners of the class, in the order they are listed.
 * @param selectedRunnerIds Ids of the runners picked for the graph; ids of other classes are
 * ignored.
 * @returns One entry per runner, in the same order.
 */
export function buildRunnerListItems(
  runners: readonly ProcessedRunnerModel[],
  selectedRunnerIds: readonly string[],
): RunnerListItem[] {
  const colors = plottedRunnerColors(runners, selectedRunnerIds)

  return runners.map((runner) => ({
    clubName: runner.club?.short_name ?? null,
    color: colors.get(runner.id),
    id: runner.id,
    name: runner.full_name,
    state: runnerListItemState(runner, selectedRunnerIds),
    statusLabelKey: unavailableStatusLabelKey(runner),
  }))
}

/**
 * Whether a runner of the list can be picked for the graph.
 *
 * @param item Entry of the runner list.
 * @returns `false` for runners without the data the graphs need.
 */
export function isSelectableItem(item: RunnerListItem): boolean {
  return item.state !== RUNNER_LIST_ITEM_STATE.Unavailable
}

/**
 * Whether a runner of the list is plotted in the graph.
 *
 * @param item Entry of the runner list.
 * @returns `true` when the runner is selected.
 */
export function isSelectedItem(item: RunnerListItem): boolean {
  return item.state === RUNNER_LIST_ITEM_STATE.Selected
}

/**
 * Colour of the line of every plotted runner. The graphs colour their series by order, so the
 * colours are handed out in the order of the class to the selected runners that have splits.
 *
 * @param runners Runners of the class, in the order the graphs plot them.
 * @param selectedRunnerIds Ids of the runners picked for the graph.
 * @returns The colour of each plotted runner by runner id; runners that are not plotted are absent.
 */
export function plottedRunnerColors(
  runners: readonly ProcessedRunnerModel[],
  selectedRunnerIds: readonly string[],
): Map<string, string> {
  const plottedRunners = runners.filter(
    (runner) => selectedRunnerIds.includes(runner.id) && hasChipDownload(runner),
  )
  return new Map(plottedRunners.map((runner, index) => [runner.id, getAccessibleColor(index)]))
}

/**
 * Ids of every runner of the list that can be plotted.
 *
 * @param items Runners of the list.
 * @returns The ids, in list order.
 */
export function selectableRunnerIds(items: readonly RunnerListItem[]): string[] {
  return items.filter(isSelectableItem).map((item) => item.id)
}

/**
 * Number of runners of the list that are plotted.
 *
 * @param items Runners of the list.
 * @returns The count of selected runners.
 */
export function selectedRunnerCount(items: readonly RunnerListItem[]): number {
  return items.filter(isSelectedItem).length
}

/**
 * Adds a runner to the selection, or takes it out when it was already there.
 *
 * @param selectedRunnerIds Ids currently selected.
 * @param runnerId Id of the runner the user clicked.
 * @returns The new selection.
 */
export function toggleRunnerId(selectedRunnerIds: readonly string[], runnerId: string): string[] {
  return selectedRunnerIds.includes(runnerId)
    ? selectedRunnerIds.filter((id) => id !== runnerId)
    : [...selectedRunnerIds, runnerId]
}

/**
 * State of a runner in the list.
 *
 * @param runner Runner of the class.
 * @param selectedRunnerIds Ids of the runners picked for the graph.
 * @returns Unavailable when the runner cannot be plotted, otherwise whether it is selected.
 */
function runnerListItemState(
  runner: ProcessedRunnerModel,
  selectedRunnerIds: readonly string[],
): RunnerListItemState {
  if (!isSelectableRunner(runner)) return RUNNER_LIST_ITEM_STATE.Unavailable
  return selectedRunnerIds.includes(runner.id)
    ? RUNNER_LIST_ITEM_STATE.Selected
    : RUNNER_LIST_ITEM_STATE.Unselected
}

/**
 * Translation key of the result status that explains why a runner cannot be plotted, such as did
 * not start or missing punch.
 *
 * @param runner Runner of the class.
 * @returns `null` for a runner that can be plotted, and for one left out with a regular or unknown
 * status, which has nothing worth showing.
 */
function unavailableStatusLabelKey(runner: ProcessedRunnerModel): string | null {
  const statusCode = runner.stage.status_code
  if (isSelectableRunner(runner) || !statusCode) return null
  if (statusCode === RESULT_STATUS.ok || !KNOWN_RESULT_STATUSES.includes(statusCode)) return null
  return `ResultsStage.statusCodes.${parseResultStatus(statusCode)}`
}
