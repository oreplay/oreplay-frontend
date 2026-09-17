import { describe, expect, it } from "vitest"
import {
  INVALID_CREDENTIALS,
  LOGIN_CHALLENGE_EXPIRED,
  loginErrorFromStatus,
  loginErrorMessageKey,
  parseLoginError,
} from "./loginError.ts"

describe("loginErrorFromStatus", () => {
  it("maps an unauthorized status to invalid credentials", () => {
    expect(loginErrorFromStatus("401")).toBe(INVALID_CREDENTIALS)
  })

  it.each([null, "", "500"])("ignores the status %s", (status) => {
    expect(loginErrorFromStatus(status)).toBeUndefined()
  })
})

describe("loginErrorMessageKey", () => {
  it.each([
    [INVALID_CREDENTIALS, "Sign in.InvalidCredentials"],
    [LOGIN_CHALLENGE_EXPIRED, "Sign in.LoginChallengeExpired"],
  ] as const)("returns the translation key of %s", (error, messageKey) => {
    expect(loginErrorMessageKey(error)).toBe(messageKey)
  })
})

describe("parseLoginError", () => {
  it.each([INVALID_CREDENTIALS, LOGIN_CHALLENGE_EXPIRED])("accepts %s", (error) => {
    expect(parseLoginError(error)).toBe(error)
  })

  it.each([null, "", "somethingElse"])("rejects %s", (value) => {
    expect(parseLoginError(value)).toBeUndefined()
  })
})
