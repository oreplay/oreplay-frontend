import { describe, expect, it } from "vitest"
import { isXmlFile, splitXmlFiles } from "./xmlFiles.ts"

const fileNamed = (name: string) => new File(["<xml/>"], name)

describe("isXmlFile", () => {
  it("accepts the .xml extension in any case", () => {
    expect(isXmlFile(fileNamed("results.xml"))).toBe(true)
    expect(isXmlFile(fileNamed("RESULTS.XML"))).toBe(true)
  })

  it("rejects other extensions and names that only contain xml", () => {
    expect(isXmlFile(fileNamed("results.csv"))).toBe(false)
    expect(isXmlFile(fileNamed("xml-results.txt"))).toBe(false)
  })
})

describe("splitXmlFiles", () => {
  it("keeps the original order on each side", () => {
    const first = fileNamed("a.xml")
    const ignored = fileNamed("b.pdf")
    const second = fileNamed("c.xml")

    expect(splitXmlFiles([first, ignored, second])).toEqual({
      accepted: [first, second],
      rejected: [ignored],
    })
  })
})
