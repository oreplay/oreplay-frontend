import { describe, expect, it } from "vitest"
import { podiumA } from "./podiumA.ts"
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

describe("podiumA (podium list)", () => {
  it("groups by class, a heading then 'position. name - club' lines (club omitted when absent)", () => {
    const sections = podiumA.buildSections([
      runner({ class: "M21", fullname: "Bob", position: 1, club: "AC" }),
      runner({ class: "M21", fullname: "Cid", position: 2, club: null }),
      runner({ class: "W21", fullname: "Dana", position: 1, club: "BC" }),
    ])
    expect(sections[0].elements.map((element) => element.content)).toEqual([
      "M21",
      "1. Bob - AC",
      "2. Cid",
      "W21",
      "1. Dana - BC",
    ])
  })

  it("inserts a page break when the list overflows the page", () => {
    const many = Array.from({ length: 60 }, (_, index) =>
      runner({ fullname: `R${index}`, position: index + 1 }),
    )
    const types = podiumA.buildSections(many)[0].elements.map((element) => element.type)
    expect(types).toContain("breakPage")
  })
})
