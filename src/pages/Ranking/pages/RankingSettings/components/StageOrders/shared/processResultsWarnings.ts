import { Participant } from "../../../../../../../domain/types/v1api"
import { runnersWithoutResult } from "./runnersWithoutResult.ts"

export const PROCESS_RESULTS_WARNINGS = [
  {
    id: "classesMissingInEvent",
    labelKey: "StageOrders.warningClassesMissingInEvent",
  },
  {
    id: "classesNotInDefinition",
    labelKey: "StageOrders.warningClassesNotInDefinition",
  },
  {
    id: "runnersWithoutResult",
    labelKey: "StageOrders.warningRunnersWithoutResult",
  },
] as const

export type ProcessResultsWarningId = (typeof PROCESS_RESULTS_WARNINGS)[number]["id"]

export interface ProcessResultsWarning {
  id: ProcessResultsWarningId
  names: string[]
}

const NAMES_IN_WARNING = 5
const NAMES_SEPARATOR = ", "
const MORE_NAMES = "…"

const missingFrom = (names: string[], others: string[]) =>
  names.filter((name) => !others.includes(name))

const warningOf = (id: ProcessResultsWarningId, names: string[]): ProcessResultsWarning[] =>
  names.length > 0 ? [{ id, names }] : []

/** Keeps the warning sentence short when a whole class is still in race. */
export function summarizeWarningNames(names: string[]): string {
  const shown = names.slice(0, NAMES_IN_WARNING).join(NAMES_SEPARATOR)
  return names.length > NAMES_IN_WARNING ? `${shown}${NAMES_SEPARATOR}${MORE_NAMES}` : shown
}

/**
 * The compute endpoint ranks the event classes whose short name is included by
 * the ranking, so a ranking class the event lacks silently ranks nobody. The
 * classes the ranking leaves out are reported only next to such a mismatch,
 * since on their own they are the normal way to rank part of an event. With no
 * included names the ranking takes every class and there is nothing to compare.
 */
export function rankingClassWarnings(
  includedClassNames: string[],
  eventClassNames: string[],
): ProcessResultsWarning[] {
  if (includedClassNames.length === 0) return []
  const missingInEvent = missingFrom(includedClassNames, eventClassNames)
  if (missingInEvent.length === 0) return []
  return [
    ...warningOf("classesMissingInEvent", missingInEvent),
    ...warningOf("classesNotInDefinition", missingFrom(eventClassNames, includedClassNames)),
  ]
}

export function runnersWithoutResultWarnings(participants: Participant[]): ProcessResultsWarning[] {
  return warningOf("runnersWithoutResult", runnersWithoutResult(participants))
}

export function areWarningsAcknowledged(
  warnings: ProcessResultsWarning[],
  acknowledgedIds: ProcessResultsWarningId[],
): boolean {
  return warnings.every((warning) => acknowledgedIds.includes(warning.id))
}

export function warningLabelKey(id: ProcessResultsWarningId): string {
  return PROCESS_RESULTS_WARNINGS.find((warning) => warning.id === id)?.labelKey ?? ""
}
