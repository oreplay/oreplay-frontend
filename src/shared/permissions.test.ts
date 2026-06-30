import { describe, expect, it } from "vitest"
import { hasScope, isAdmin } from "./permissions.ts"
import { UserModel } from "./EntityTypes.ts"

const userWith = (scope?: string): UserModel => ({
  id: "1",
  email: "a@b.c",
  first_name: "A",
  last_name: "B",
  scope,
  created: "",
  modified: "",
  token: { access_token: "", token_type: "bearer" },
})

describe("isAdmin", () => {
  it("is true when the user has the global '*' scope", () => {
    expect(isAdmin(userWith("*"))).toBe(true)
    expect(isAdmin(userWith("ranking:r * events:w"))).toBe(true)
  })

  it("is false without '*' (including granular grants and no scope)", () => {
    expect(isAdmin(userWith("ranking:r"))).toBe(false)
    expect(isAdmin(userWith(""))).toBe(false)
    expect(isAdmin(userWith(undefined))).toBe(false)
    expect(isAdmin(null)).toBe(false)
  })
})

describe("hasScope", () => {
  it("matches an exact scope token in a delimited list", () => {
    expect(hasScope(userWith("ranking:r events:w"), "ranking:r")).toBe(true)
    expect(hasScope(userWith("ranking:r,events:w"), "events:w")).toBe(true)
    expect(hasScope(userWith("ranking:r"), "ranking:*")).toBe(false)
  })
})
