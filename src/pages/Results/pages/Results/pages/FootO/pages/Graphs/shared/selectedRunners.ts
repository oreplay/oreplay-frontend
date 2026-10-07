import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { hasChipDownload } from "../../../../../shared/functions.ts"

export const DEFAULT_SELECTED_RUNNERS_COUNT = 5
export const SELECTED_RUNNERS_STORAGE_KEY = "selectedRunners"

export function isSelectableRunner(runner: ProcessedRunnerModel): boolean {
  return !!runner.stage.position && hasChipDownload(runner)
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
