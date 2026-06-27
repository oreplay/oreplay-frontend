import { RankingOverallSettings } from "./types/v1api"

// `overall_settings` is stored as a JSON object string with these circuit/season
// keys. The form keeps them in this fixed order; empty fields are omitted from
// the serialized object.
export const OVERALL_SETTINGS_FIELDS = [
  {
    key: "totalCircuitRaces",
    labelKey: "Ranking.Settings.overallValues.totalCircuitRaces",
  },
  {
    key: "maxRacesCounted",
    labelKey: "Ranking.Settings.overallValues.maxRacesCounted",
  },
  {
    key: "organizerScoringFraction",
    labelKey: "Ranking.Settings.overallValues.organizerScoringFraction",
  },
  {
    key: "minPointsAsOrg",
    labelKey: "Ranking.Settings.overallValues.minPointsAsOrg",
  },
] as const

export function parseOverallSettings(
  value: RankingOverallSettings | undefined,
): (number | null)[] {
  return OVERALL_SETTINGS_FIELDS.map(({ key }) => {
    const v = value?.[key]
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
