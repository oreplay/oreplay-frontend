import { describe, expect, it } from "vitest"
import { joinFieldErrors } from "./fieldErrors.ts"

describe("joinFieldErrors", () => {
  it("joins the present messages", () => {
    expect(joinFieldErrors(["Required", undefined, "Too long"])).toBe("Required Too long")
  })

  it("returns undefined when there is no message", () => {
    expect(joinFieldErrors([])).toBeUndefined()
    expect(joinFieldErrors([undefined])).toBeUndefined()
  })
})
