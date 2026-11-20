export const ROUND_DOWN_TO_INTEGER = -1

export const ROUND_PRECISION_OPTIONS = [
  { value: ROUND_DOWN_TO_INTEGER, labelKey: "Settings.roundPrecisionValues.floor" },
  { value: 0, labelKey: "Settings.roundPrecisionValues.integer" },
  { value: 1, labelKey: "Settings.roundPrecisionValues.one" },
  { value: 2, labelKey: "Settings.roundPrecisionValues.two" },
  { value: 3, labelKey: "Settings.roundPrecisionValues.three" },
] as const

export type RoundPrecision = (typeof ROUND_PRECISION_OPTIONS)[number]["value"]
