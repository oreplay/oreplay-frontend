import { describe, expect, it } from "vitest"
import { loginErrorFromStatus, loginErrorMessageKey, parseLoginError } from "./loginError.ts"

describe("loginErrorFromStatus", () => {
  it("maps an unauthorized status to invalid credentials", () => {
    expect(loginErrorFromStatus("401")).toBe("invalidCredentials")
  })

  it.each([null, "", "500"])("ignores the status %s", (status) => {
    expect(loginErrorFromStatus(status)).toBeUndefined()
  })
})

describe("loginErrorMessageKey", () => {
  it("returns the translation key of a login error", () => {
    expect(loginErrorMessageKey("invalidCredentials")).toBe("Sign in.InvalidCredentials")
  })
})

describe("parseLoginError", () => {
  it("accepts a known login error", () => {
    expect(parseLoginError("invalidCredentials")).toBe("invalidCredentials")
  })

  it.each([null, "", "somethingElse"])("rejects %s", (value) => {
    expect(parseLoginError(value)).toBeUndefined()
  })
})
