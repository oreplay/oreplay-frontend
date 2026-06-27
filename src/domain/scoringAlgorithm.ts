// Scoring algorithms the backend accepts (PHP class FQNs). One for now; add
// entries here as more are supported and the select grows automatically.
export const SCORING_ALGORITHM_OPTIONS = [
  {
    value: "Rankings\\Lib\\ScoringAlgorithms\\SimpleScoreCalculator",
    labelKey: "Ranking.Settings.scoringAlgorithmValues.simpleScore",
  },
] as const

export type ScoringAlgorithm =
  (typeof SCORING_ALGORITHM_OPTIONS)[number]["value"]
