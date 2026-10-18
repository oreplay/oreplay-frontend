import { describe, expect, it, vi } from "vitest"
import { competitionResultsMenuItems } from "./competitionResultsMenu.ts"

const labels = { exportLabel: "Export results", duplicatedRunnersLabel: "Duplicated runners" }

describe("competitionResultsMenuItems", () => {
  it("links to the duplicated runners of an existing ranking", () => {
    const items = competitionResultsMenuItems({ ...labels, rankingId: "rk-1", onExport: vi.fn() })
    expect(items.map(({ label }) => label)).toEqual(["Export results", "Duplicated runners"])
    expect(items[1].to).toBe("/admin/rankings/rk-1/duplicated-runners")
  })

  it("offers only the export before the ranking exists", () => {
    const items = competitionResultsMenuItems({ ...labels, onExport: vi.fn() })
    expect(items.map(({ label }) => label)).toEqual(["Export results"])
  })

  it("opens the export when its item is selected", () => {
    const onExport = vi.fn()
    competitionResultsMenuItems({ ...labels, onExport })[0].onSelect?.()
    expect(onExport).toHaveBeenCalled()
  })
})
