import { describe, expect, it } from "vitest"
import { GetEventTokenResponse } from "../../../../../../../shared/EntityTypes.ts"
import { latestEventToken } from "./eventTokens.ts"

/**
 * Builds a token that expires at the given instant.
 * @param token The token value.
 * @param expires ISO instant when the token stops being valid.
 * @returns A token as the backend lists it.
 */
function buildToken(token: string, expires: string): GetEventTokenResponse {
  return { token, expires, created: "2026-01-01T00:00:00+00:00" }
}

describe("latestEventToken", () => {
  it("returns null when the event has no token", () => {
    expect(latestEventToken([])).toBeNull()
  })

  it("returns the token that expires last, whatever the order", () => {
    const older = buildToken("older", "2026-02-01T00:00:00+00:00")
    const newer = buildToken("newer", "2026-03-01T00:00:00+00:00")

    expect(latestEventToken([older, newer])).toBe(newer)
    expect(latestEventToken([newer, older])).toBe(newer)
  })
})
