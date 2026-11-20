import { describe, expect, it, vi } from "vitest"
import { competitionResultsMenuItems } from "./competitionResultsMenu.ts"

const labels = {
  exportLabel: "Export results",
  clubRankingLabel: "Export club ranking",
  duplicatedRunnersLabel: "Duplicated runners",
}
const handlers = { onExport: vi.fn(), onExportClubRanking: vi.fn() }

describe("competitionResultsMenuItems", () => {
  it("offers the club ranking and the duplicated runners of an existing ranking", () => {
    const items = competitionResultsMenuItems({ ...labels, ...handlers, rankingId: "rk-1" })
    expect(items.map(({ label }) => label)).toEqual([
      "Export results",
      "Export club ranking",
      "Duplicated runners",
    ])
    expect(items[2].to).toBe("/admin/rankings/rk-1/duplicated-runners")
  })

  it("offers only the export before the ranking exists", () => {
    const items = competitionResultsMenuItems({ ...labels, ...handlers })
    expect(items.map(({ label }) => label)).toEqual(["Export results"])
  })

  it("opens the export when its item is selected", () => {
    const onExport = vi.fn()
    competitionResultsMenuItems({ ...labels, ...handlers, onExport })[0].onSelect?.()
    expect(onExport).toHaveBeenCalled()
  })

  it("opens the club ranking export when its item is selected", () => {
    const onExportClubRanking = vi.fn()
    competitionResultsMenuItems({
      ...labels,
      ...handlers,
      rankingId: "rk-1",
      onExportClubRanking,
    })[1].onSelect?.()
    expect(onExportClubRanking).toHaveBeenCalled()
  })
})
