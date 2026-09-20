export const PROCESS_RESULTS_WARNINGS = [
  {
    id: "classesMissingInEvent",
    labelKey: "StageOrders.warningClassesMissingInEvent",
  },
  {
    id: "classesNotInDefinition",
    labelKey: "StageOrders.warningClassesNotInDefinition",
  },
] as const

export type ProcessResultsWarningId = (typeof PROCESS_RESULTS_WARNINGS)[number]["id"]

export interface ProcessResultsWarning {
  id: ProcessResultsWarningId
  classNames: string[]
}

const missingFrom = (names: string[], others: string[]) =>
  names.filter((name) => !others.includes(name))

const warningOf = (id: ProcessResultsWarningId, classNames: string[]): ProcessResultsWarning[] =>
  classNames.length > 0 ? [{ id, classNames }] : []

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

export function areWarningsAcknowledged(
  warnings: ProcessResultsWarning[],
  acknowledgedIds: ProcessResultsWarningId[],
): boolean {
  return warnings.every((warning) => acknowledgedIds.includes(warning.id))
}

export function warningLabelKey(id: ProcessResultsWarningId): string {
  return PROCESS_RESULTS_WARNINGS.find((warning) => warning.id === id)?.labelKey ?? ""
}
