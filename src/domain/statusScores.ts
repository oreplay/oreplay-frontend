// `status_scores` is stored as a 6-element JSON array string; the array INDEX is
// the runner's StatusCode, so it decomposes into one field per status (fixed
// order). A `null` at a position means "no override — use the computed score".
// (NC is handled separately by nc_true/nc_false, not here.)
export const STATUS_SCORE_FIELDS = [
  { index: 0, labelKey: "ResultsStage.statusCodes.ok" },
  { index: 1, labelKey: "ResultsStage.statusCodes.dns" },
  { index: 2, labelKey: "ResultsStage.statusCodes.dnf" },
  { index: 3, labelKey: "ResultsStage.statusCodes.mp" },
  { index: 4, labelKey: "ResultsStage.statusCodes.dsq" },
  { index: 5, labelKey: "ResultsStage.statusCodes.ot" },
] as const

const emptyStatusScores = (): (number | null)[] => STATUS_SCORE_FIELDS.map(() => null)

export function parseStatusScores(raw: string | null | undefined): (number | null)[] {
  if (!raw) return emptyStatusScores()
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return emptyStatusScores()
    return STATUS_SCORE_FIELDS.map((_, i) => {
      const value: unknown = parsed[i]
      return typeof value === "number" ? value : null
    })
  } catch {
    return emptyStatusScores()
  }
}

export function serializeStatusScores(values: (number | null)[]): string {
  return JSON.stringify(STATUS_SCORE_FIELDS.map((_, i) => values[i] ?? null))
}
