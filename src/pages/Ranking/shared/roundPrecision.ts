export const ROUND_PRECISION_OPTIONS = [
  { value: -1, labelKey: "Settings.roundPrecisionValues.floor" },
  { value: 0, labelKey: "Settings.roundPrecisionValues.integer" },
  { value: 1, labelKey: "Settings.roundPrecisionValues.one" },
  { value: 2, labelKey: "Settings.roundPrecisionValues.two" },
  { value: 3, labelKey: "Settings.roundPrecisionValues.three" },
] as const

export type RoundPrecision = (typeof ROUND_PRECISION_OPTIONS)[number]["value"]
