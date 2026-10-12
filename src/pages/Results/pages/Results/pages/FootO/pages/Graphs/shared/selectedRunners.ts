import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { hasChipDownload } from "../../../../../shared/functions.ts"

export const DEFAULT_SELECTED_RUNNERS_COUNT = 5
export const SELECTED_RUNNERS_STORAGE_KEY = "selectedRunners"

export function isSelectableRunner(runner: ProcessedRunnerModel): boolean {
  return !!runner.stage.position && hasChipDownload(runner)
}

/**
 * Whether the graph should fall back to the default runners: nothing selected belongs to the class
 * on screen, as on a first visit or after moving to another class.
 *
 * @param runners Runners of the class.
 * @param selectedRunnerIds Ids currently selected, possibly of another class.
 * @returns `false` while the class is still empty or one of its runners is selected.
 */
export function needsDefaultSelection(
  runners: ProcessedRunnerModel[],
  selectedRunnerIds: string[],
): boolean {
  return runners.length > 0 && !runners.some((runner) => selectedRunnerIds.includes(runner.id))
}

export function parseStoredRunnerIds(storedRunnerIds: string | null): string[] {
  if (!storedRunnerIds) return []

  try {
    const parsedRunnerIds: unknown = JSON.parse(storedRunnerIds)
    return isStringArray(parsedRunnerIds) ? parsedRunnerIds : []
  } catch {
    return []
  }
}

export function pickDefaultSelectedRunnerIds(runners: ProcessedRunnerModel[]): string[] {
  return runners
    .filter(isSelectableRunner)
    .sort((a, b) => (a.stage.position || 0) - (b.stage.position || 0))
    .slice(0, DEFAULT_SELECTED_RUNNERS_COUNT)
    .map((runner) => runner.id)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}
