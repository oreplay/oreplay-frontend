import { describe, expect, it } from "vitest"
import { buildRankingListBreadcrumbs, buildRankingSettingsBreadcrumbs } from "./breadcrumbs.ts"

const labels = { dashboard: "Dashboard", ranking: "Ranking" }

describe("ranking breadcrumbs", () => {
  it("builds the list trail with the last crumb as the current page", () => {
    expect(buildRankingListBreadcrumbs(labels)).toEqual([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Ranking" },
    ])
  })

  it("builds the settings trail ending in the selected ranking label", () => {
    expect(buildRankingSettingsBreadcrumbs(labels, "Regional 2025")).toEqual([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Ranking", to: "/admin/rankings" },
      { label: "Regional 2025" },
    ])
  })
})
