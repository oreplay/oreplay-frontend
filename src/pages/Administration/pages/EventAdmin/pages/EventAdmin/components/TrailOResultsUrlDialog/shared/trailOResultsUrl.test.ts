import { describe, expect, it } from "vitest"
import { isTrailOResultsUrl, isValidTrailOResultsInput, toExternalUrl } from "./trailOResultsUrl.ts"

describe("isTrailOResultsUrl", () => {
  it.each([
    "https://top.yq.cz/event/123/results",
    "https://jaruori.es/eventos/2021xermade/index.html",
    "http://www.jaruori.es/eventos/goente2020/index.html",
    "https://TOP.YQ.CZ/event/1",
  ])("accepts the TOP or Jaruori url %s", (url) => {
    expect(isTrailOResultsUrl(url)).toBe(true)
  })

  it.each([
    "https://www.oreplay.es/results",
    "https://evil-jaruori.es/results",
    "https://fake.top.yq.cz/results",
    "https://example.com/top.yq.cz",
    "ftp://top.yq.cz/results",
    "javascript://top.yq.cz/%0Aalert(1)",
    "top.yq.cz/results",
    "",
  ])("rejects %s", (url) => {
    expect(isTrailOResultsUrl(url)).toBe(false)
  })
})

describe("isValidTrailOResultsInput", () => {
  it("accepts an empty input, which clears the url", () => {
    expect(isValidTrailOResultsInput("  ")).toBe(true)
  })

  it("accepts a TOP or Jaruori url surrounded by spaces", () => {
    expect(isValidTrailOResultsInput(" https://jaruori.es/eventos/1 ")).toBe(true)
  })

  it("rejects a url from any other site", () => {
    expect(isValidTrailOResultsInput("https://example.com/results")).toBe(false)
  })
})

describe("toExternalUrl", () => {
  it("trims the url", () => {
    expect(toExternalUrl("  https://top.yq.cz/event/1 ")).toBe("https://top.yq.cz/event/1")
  })

  it("clears the url when it is left empty", () => {
    expect(toExternalUrl("   ")).toBeNull()
  })
})
