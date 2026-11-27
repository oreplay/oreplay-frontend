import { describe, expect, it } from "vitest"
import { diplomaA } from "./diplomaA.ts"
import { diplomaB } from "./diplomaB.ts"
import { ExportRunner } from "../exportRunners.ts"

const runner: ExportRunner = {
  fullname: "Ada Lovelace",
  class: "W21",
  club: "OK Club",
  participants: null,
  sex: "F",
  position: 1,
}

describe("diplomaB", () => {
  it("has no background on A and the fegado pdf on B", () => {
    expect(diplomaA.backgroundPdf).toBeNull()
    expect(diplomaB.backgroundPdf).toBe(
      "https://d1ljmtj9ckzv64.cloudfront.net/fisioOreplay/fegado.pdf",
    )
  })

  it("renders the category off-center, unlike diplomaA's centered category", () => {
    const categoryB = diplomaB.buildSections([runner])[0].elements[1]
    const categoryA = diplomaA.buildSections([runner])[0].elements[1]
    expect(categoryA.type).toBe("centeredElement")
    expect(categoryA.position?.x).toBeUndefined()
    expect(categoryB.type).toBe("text")
    expect(categoryB.position?.x).toBeGreaterThan(0)
  })

  it("renders the category and position in bold on diplomaB only", () => {
    const [, categoryB, positionB] = diplomaB.buildSections([runner])[0].elements
    const [, categoryA, positionA] = diplomaA.buildSections([runner])[0].elements
    expect(categoryB.style).toBe("bold")
    expect(positionB.style).toBe("bold")
    expect(categoryA.style).toBeUndefined()
    expect(positionA.style).toBeUndefined()
  })
})
