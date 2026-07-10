import { describe, expect, it } from "vitest"
import { httpErrorMessageKey } from "./httpError.ts"

const httpError = (status: number) => ({
  isAxiosError: true,
  response: { status },
})

describe("httpErrorMessageKey", () => {
  it("maps 403 to forbidden", () => {
    expect(httpErrorMessageKey(httpError(403))).toBe("common:error.forbidden")
  })

  it("maps other 4xx to bad request", () => {
    expect(httpErrorMessageKey(httpError(400))).toBe("common:error.badRequest")
    expect(httpErrorMessageKey(httpError(404))).toBe("common:error.badRequest")
  })

  it("maps 5xx to server error", () => {
    expect(httpErrorMessageKey(httpError(500))).toBe("common:error.serverError")
  })

  it("falls back to server error for non-http errors", () => {
    expect(httpErrorMessageKey(new Error("boom"))).toBe("common:error.serverError")
  })
})
