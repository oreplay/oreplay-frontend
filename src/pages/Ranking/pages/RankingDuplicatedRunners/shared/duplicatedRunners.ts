import { ArrayParticipant } from "../../../../../domain/types/v1api"

export const DUPLICATED_RUNNERS_OUTPUT = "DuplicatedRunners"

export const DUPLICATED_RUNNER_COLUMNS = [
  "full_name",
  "bib_number",
  "class",
  "partials_size",
  "points",
] as const
export type DuplicatedRunnerColumn = (typeof DUPLICATED_RUNNER_COLUMNS)[number]

export const DUPLICATED_RUNNER_COLUMN_LABEL_KEYS: Record<DuplicatedRunnerColumn, string> = {
  full_name: "DuplicatedRunners.name",
  bib_number: "DuplicatedRunners.bibNumber",
  class: "DuplicatedRunners.class",
  partials_size: "DuplicatedRunners.partials",
  points: "DuplicatedRunners.points",
}

export const DUPLICATED_RUNNER_CELL_TONES = ["muted", "normal", "warning"] as const
export type DuplicatedRunnerCellTone = (typeof DUPLICATED_RUNNER_CELL_TONES)[number]

const SINGLE_PARTIAL = 1

const NUMERIC_COLUMNS: readonly DuplicatedRunnerColumn[] = ["partials_size", "points"]

const RUNNERS_PER_DUPLICATE = 2

export interface DuplicatedRunner {
  bib_number: number | string | null
  class: string | null
  full_name: string
  id: string
  invalidate_link: string
  partials_size: number
  points: number | null
}

export type DuplicatedRunnerPair = DuplicatedRunner[]

export function duplicatedRunnerCellTone(
  pair: DuplicatedRunnerPair,
  rowIndex: number,
  column: DuplicatedRunnerColumn,
): DuplicatedRunnerCellTone {
  if (column === "partials_size") return partialsTone(pair, rowIndex)
  return isRepeatedInPair(pair, rowIndex, column) ? "muted" : "normal"
}

export function isNumericColumn(column: DuplicatedRunnerColumn): boolean {
  return NUMERIC_COLUMNS.includes(column)
}

export function isRepeatedInPair(
  pair: DuplicatedRunnerPair,
  rowIndex: number,
  column: DuplicatedRunnerColumn,
): boolean {
  return rowIndex > 0 && String(pair[rowIndex][column]) === String(pair[0][column])
}

function partialsTone(pair: DuplicatedRunnerPair, rowIndex: number): DuplicatedRunnerCellTone {
  const own = pair[rowIndex].partials_size
  const other = pair.find((_, index) => index !== rowIndex)?.partials_size
  if (own === SINGLE_PARTIAL) return "muted"
  if (other === undefined || other === SINGLE_PARTIAL) return "normal"
  return "warning"
}

export function pairDuplicatedRunners(runners: DuplicatedRunner[]): DuplicatedRunnerPair[] {
  const pairs: DuplicatedRunnerPair[] = []
  for (let index = 0; index < runners.length; index += RUNNERS_PER_DUPLICATE) {
    pairs.push(runners.slice(index, index + RUNNERS_PER_DUPLICATE))
  }
  return pairs
}

export function readDuplicatedRunners(response?: ArrayParticipant): DuplicatedRunner[] {
  return (response?.data ?? []) as unknown as DuplicatedRunner[]
}

export function removalRequestPath(invalidateLink: string): string {
  const url = new URL(invalidateLink)
  return `${url.pathname}${url.search}`
}
