import { FedoStats, GenderGrouped, Stats } from "../../../../../../../../domain/types/v1api"

export interface StatRow {
  labelKey: string
  M: number
  F: number
  total: number
}

export interface StatTable {
  titleKey: string
  rows: StatRow[]
}

const COMMON_FIELDS: { labelKey: string; field: keyof Stats }[] = [
  { labelKey: "FedoStats.dns", field: "dns" },
  { labelKey: "FedoStats.mp", field: "mp" },
  { labelKey: "FedoStats.dnf", field: "dnf" },
  { labelKey: "FedoStats.ot", field: "ot" },
  { labelKey: "FedoStats.dqf", field: "dqf" },
]

function statValue(
  group: GenderGrouped | undefined,
  gender: "M" | "F",
  field: keyof Stats,
): number {
  const stats = gender === "M" ? group?.M : group?.F
  const value = stats?.[field]
  return typeof value === "number" ? value : 0
}

function row(labelKey: string, m: number, f: number): StatRow {
  return { labelKey, M: m, F: f, total: m + f }
}

export function buildFedoStatsTables(stats: FedoStats): { official: StatTable; others: StatTable } {
  const { officialSenior: senior, officialSub20: sub20, others } = stats

  const officialRows: StatRow[] = [
    row(
      "FedoStats.totalRegistered",
      statValue(senior, "M", "total") + statValue(sub20, "M", "total"),
      statValue(senior, "F", "total") + statValue(sub20, "F", "total"),
    ),
    row("FedoStats.totalSub20", statValue(sub20, "M", "total"), statValue(sub20, "F", "total")),
    row("FedoStats.totalSenior", statValue(senior, "M", "total"), statValue(senior, "F", "total")),
    ...COMMON_FIELDS.map(({ labelKey, field }) =>
      row(
        labelKey,
        statValue(senior, "M", field) + statValue(sub20, "M", field),
        statValue(senior, "F", field) + statValue(sub20, "F", field),
      ),
    ),
  ]

  const othersRows: StatRow[] = [
    row(
      "FedoStats.totalRegistered",
      statValue(others, "M", "total"),
      statValue(others, "F", "total"),
    ),
    ...COMMON_FIELDS.map(({ labelKey, field }) =>
      row(labelKey, statValue(others, "M", field), statValue(others, "F", field)),
    ),
  ]

  return {
    official: { titleKey: "FedoStats.officialTitle", rows: officialRows },
    others: { titleKey: "FedoStats.buckets.others", rows: othersRows },
  }
}
