// `overall_settings` is a JSON object string on the API, edited here as a
// fixed-order list of numbers (empty = omitted from the object).
export const OVERALL_SETTINGS_FIELDS = [
  {
    key: "totalCircuitRaces",
    labelKey: "Settings.overallValues.totalCircuitRaces",
    default: 4,
  },
  {
    key: "maxRacesCounted",
    labelKey: "Settings.overallValues.maxRacesCounted",
    default: 3,
  },
  {
    key: "organizerScoringFraction",
    labelKey: "Settings.overallValues.organizerScoringFraction",
    default: 0.3,
  },
  {
    key: "minPointsAsOrg",
    labelKey: "Settings.overallValues.minPointsAsOrg",
    default: 50,
  },
] as const

export type OverallSettingKey = (typeof OVERALL_SETTINGS_FIELDS)[number]["key"]

export const DEFAULT_OVERALL_SETTINGS: (number | null)[] = OVERALL_SETTINGS_FIELDS.map(
  (field) => field.default,
)

export function isTotalCircuitRacesMismatch(
  key: OverallSettingKey,
  value: number | null,
  stageOrderCount?: number,
): boolean {
  if (key !== "totalCircuitRaces" || value === null || stageOrderCount === undefined) {
    return false
  }
  return value !== stageOrderCount
}

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
