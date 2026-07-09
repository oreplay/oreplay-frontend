export const ROUND_PRECISION_OPTIONS = [
  { value: -1, labelKey: "Ranking.Settings.roundPrecisionValues.floor" },
  { value: 0, labelKey: "Ranking.Settings.roundPrecisionValues.integer" },
  { value: 1, labelKey: "Ranking.Settings.roundPrecisionValues.one" },
  { value: 2, labelKey: "Ranking.Settings.roundPrecisionValues.two" },
  { value: 3, labelKey: "Ranking.Settings.roundPrecisionValues.three" },
] as const

export type RoundPrecision = (typeof ROUND_PRECISION_OPTIONS)[number]["value"]
