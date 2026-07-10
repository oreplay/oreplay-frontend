// `overall_settings` is a JSON object string on the API, edited here as a
// fixed-order list of numbers (empty = omitted from the object).
export const OVERALL_SETTINGS_FIELDS = [
  {
    key: "totalCircuitRaces",
    labelKey: "Settings.overallValues.totalCircuitRaces",
  },
  {
    key: "maxRacesCounted",
    labelKey: "Settings.overallValues.maxRacesCounted",
  },
  {
    key: "organizerScoringFraction",
    labelKey: "Settings.overallValues.organizerScoringFraction",
  },
  {
    key: "minPointsAsOrg",
    labelKey: "Settings.overallValues.minPointsAsOrg",
  },
] as const

export function parseOverallSettings(raw: string | null | undefined): (number | null)[] {
  let parsed: Record<string, unknown> = {}
  if (raw) {
    try {
      const value: unknown = JSON.parse(raw)
      if (value && typeof value === "object") {
        parsed = value as Record<string, unknown>
      }
    } catch {
      parsed = {}
    }
  }
  return OVERALL_SETTINGS_FIELDS.map(({ key }) => {
    const v = parsed[key]
    return typeof v === "number" ? v : null
  })
}

export function serializeOverallSettings(values: (number | null)[]): string {
  const result: Record<string, number> = {}
  OVERALL_SETTINGS_FIELDS.forEach(({ key }, i) => {
    const v = values[i]
    if (v !== null && v !== undefined) result[key] = v
  })
  return JSON.stringify(result)
}
