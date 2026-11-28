import { describe, expect, it } from "vitest"
import { FedoStats } from "../../../../../../../../domain/types/v1api"
import { buildFedoStatsTables } from "./fedoStatsTables.ts"

const stats: FedoStats = {
  officialSenior: {
    M: { total: 10, dns: 1, mp: 0, dnf: 2, ot: 0, dqf: 1 },
    F: { total: 8, dns: 0, mp: 1, dnf: 0, ot: 1, dqf: 0 },
  },
  officialSub20: {
    M: { total: 4, dns: 0, mp: 0, dnf: 1, ot: 0, dqf: 0 },
    F: { total: 3, dns: 1, mp: 0, dnf: 0, ot: 0, dqf: 0 },
  },
  others: {
    M: { total: 5, dns: 0, mp: 1, dnf: 0, ot: 0, dqf: 0 },
    F: { total: 2, dns: 0, mp: 0, dnf: 0, ot: 0, dqf: 0 },
  },
}

describe("buildFedoStatsTables", () => {
  it("aggregates senior+sub20 into the official table with subtotals and M+F totals", () => {
    const { official } = buildFedoStatsTables(stats)
    const byKey = Object.fromEntries(official.rows.map((r) => [r.labelKey, r]))
    expect(byKey["FedoStats.totalRegistered"]).toEqual({
      labelKey: "FedoStats.totalRegistered",
      M: 14,
      F: 11,
      total: 25,
    })
    expect(byKey["FedoStats.totalSub20"]).toMatchObject({ M: 4, F: 3, total: 7 })
    expect(byKey["FedoStats.totalSenior"]).toMatchObject({ M: 10, F: 8, total: 18 })
    expect(byKey["FedoStats.dnf"]).toMatchObject({ M: 3, F: 0, total: 3 })
  })

  it("maps the others group into its own table", () => {
    const { others } = buildFedoStatsTables(stats)
    const total = others.rows.find((r) => r.labelKey === "FedoStats.totalRegistered")
    expect(total).toMatchObject({ M: 5, F: 2, total: 7 })
  })
})
