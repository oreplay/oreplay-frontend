import { describe, expect, it } from "vitest"
import { diplomaA } from "./diplomaA.ts"
import { ExportRunner } from "../exportRunners.ts"

const runner = (over: Partial<ExportRunner>): ExportRunner => ({
  fullname: "Ada Lovelace",
  class: "W21",
  club: "OK Club",
  participants: null,
  sex: "F",
  position: 1,
  ...over,
})

describe("diplomaA", () => {
  it("renders name, detail and club, omitting club when absent", () => {
    const withClub = diplomaA.buildSections([runner({})])
    expect(withClub[0].elements.map((element) => element.content)).toEqual([
      "Ada Lovelace",
      "W21 · 1",
      "OK Club",
    ])

    const withoutClub = diplomaA.buildSections([runner({ club: null })])
    expect(withoutClub[0].elements.map((element) => element.content)).toEqual([
      "Ada Lovelace",
      "W21 · 1",
    ])
  })
})
