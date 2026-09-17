import { describe, expect, it } from "vitest"
import { DateTime } from "luxon"
import { isLoginChallengeStale, isUntouchedLoginChallengeStale } from "./loginChallenge.ts"

const requestedAt = DateTime.fromISO("2026-09-17T10:00:00Z")
const staleNow = requestedAt.plus({ seconds: 100 })

function formData(fields: Record<string, string>): FormData {
  const data = new FormData()
  Object.entries(fields).forEach(([name, value]) => data.set(name, value))
  return data
}

describe("isLoginChallengeStale", () => {
  it("keeps a challenge usable within its safe window", () => {
    expect(isLoginChallengeStale(requestedAt, requestedAt.plus({ seconds: 99 }))).toBe(false)
  })

  it("treats a challenge as stale once the safety margin is reached", () => {
    expect(isLoginChallengeStale(requestedAt, staleNow)).toBe(true)
  })

  it("treats an unknown request time as stale", () => {
    expect(isLoginChallengeStale(DateTime.invalid("missing"), requestedAt)).toBe(true)
  })
})

describe("isUntouchedLoginChallengeStale", () => {
  const emptyForm = formData({ username: "", password: "", client_id: "2658" })

  it("is stale when nothing is typed and the challenge is stale", () => {
    expect(isUntouchedLoginChallengeStale(emptyForm, requestedAt, staleNow)).toBe(true)
  })

  it("is not stale while the challenge is still usable", () => {
    expect(isUntouchedLoginChallengeStale(emptyForm, requestedAt, requestedAt)).toBe(false)
  })

  it.each([
    ["username", { username: "runner@example.com", password: "" }],
    ["password", { username: "", password: "secret" }],
  ])("is not stale once the %s is typed", (_, fields) => {
    expect(isUntouchedLoginChallengeStale(formData(fields), requestedAt, staleNow)).toBe(false)
  })
})
