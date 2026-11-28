import { describe, expect, it } from "vitest"
import { withApiPrefix } from "./calculateRankingBatches.ts"

describe("withApiPrefix", () => {
  it("adds the API prefix to a relative compute URL", () => {
    expect(withApiPrefix("/rankings/r1/compute")).toBe("/api/v1/rankings/r1/compute")
  })

  it("keeps a URL that already carries the prefix", () => {
    expect(withApiPrefix("/api/v1/rankings/r1/compute")).toBe("/api/v1/rankings/r1/compute")
  })
})
