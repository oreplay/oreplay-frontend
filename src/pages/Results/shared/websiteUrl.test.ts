import { describe, expect, it } from "vitest"
import { parseWebsiteUrl } from "./websiteUrl.ts"

describe("parseWebsiteUrl", () => {
  it("returns null for a missing website", () => {
    expect(parseWebsiteUrl(undefined)).toBeNull()
    expect(parseWebsiteUrl(null)).toBeNull()
    expect(parseWebsiteUrl("")).toBeNull()
  })

  it("keeps an existing protocol", () => {
    expect(parseWebsiteUrl("http://example.com/race")?.toString()).toBe("http://example.com/race")
  })

  it("adds https when the protocol is missing", () => {
    expect(parseWebsiteUrl("example.com")?.toString()).toBe("https://example.com/")
  })

  it("returns null for an invalid website", () => {
    expect(parseWebsiteUrl("not a url")).toBeNull()
  })
})
