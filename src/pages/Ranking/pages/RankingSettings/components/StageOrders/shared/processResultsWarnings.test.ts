import { describe, expect, it } from "vitest"
import {
  areWarningsAcknowledged,
  rankingClassWarnings,
  warningLabelKey,
} from "./processResultsWarnings.ts"

describe("rankingClassWarnings", () => {
  it("warns about the ranking classes that the event does not have", () => {
    expect(rankingClassWarnings(["M-21", "W-21"], ["M-21"])).toEqual([
      { id: "classesMissingInEvent", classNames: ["W-21"] },
    ])
  })

  it("stays silent about the event classes the ranking leaves out when nothing is missing", () => {
    expect(rankingClassWarnings(["M-21"], ["M-21", "W-21"])).toEqual([])
  })

  it("reports the classes the ranking leaves out next to a missing one", () => {
    expect(rankingClassWarnings(["M-21", "M-E"], ["M-21", "W-21"])).toEqual([
      { id: "classesMissingInEvent", classNames: ["M-E"] },
      { id: "classesNotInDefinition", classNames: ["W-21"] },
    ])
  })

  it("is silent when both sides hold the same classes", () => {
    expect(rankingClassWarnings(["M-21", "W-21"], ["W-21", "M-21"])).toEqual([])
  })

  it("is silent when the ranking includes every class of the event", () => {
    expect(rankingClassWarnings([], ["M-21", "W-21"])).toEqual([])
  })
})

describe("areWarningsAcknowledged", () => {
  const warnings = rankingClassWarnings(["M-21", "M-E"], ["M-21", "W-21"])

  it("needs every warning acknowledged", () => {
    expect(areWarningsAcknowledged(warnings, [])).toBe(false)
    expect(areWarningsAcknowledged(warnings, ["classesMissingInEvent"])).toBe(false)
    expect(
      areWarningsAcknowledged(warnings, ["classesMissingInEvent", "classesNotInDefinition"]),
    ).toBe(true)
  })

  it("holds with nothing to acknowledge", () => {
    expect(areWarningsAcknowledged([], [])).toBe(true)
  })
})

describe("warningLabelKey", () => {
  it("names the translation key of each warning", () => {
    expect(warningLabelKey("classesMissingInEvent")).toBe(
      "StageOrders.warningClassesMissingInEvent",
    )
  })
})
