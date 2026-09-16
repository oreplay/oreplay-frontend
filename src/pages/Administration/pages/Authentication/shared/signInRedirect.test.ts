import { describe, expect, it } from "vitest"
import { resolveRedirectPath, signInPath } from "./signInRedirect.ts"

describe("signInPath", () => {
  it("carries the current path and query to the sign-in page", () => {
    expect(signInPath({ pathname: "/admin/rankings", search: "?page=2" })).toBe(
      "/signin?redirect=%2Fadmin%2Frankings%3Fpage%3D2",
    )
  })
})

describe("resolveRedirectPath", () => {
  it("returns an in-app path unchanged", () => {
    expect(resolveRedirectPath("/admin/rankings/42/settings")).toBe("/admin/rankings/42/settings")
  })

  it.each([
    ["missing", null],
    ["empty", ""],
    ["absolute URL", "https://evil.example/admin"],
    ["protocol-relative URL", "//evil.example/admin"],
    ["backslash host", "/\\evil.example"],
    ["relative path", "admin/rankings"],
    ["sign-in page", "/signin/auth?code=abc"],
  ])("falls back to the dashboard for a %s", (_, path) => {
    expect(resolveRedirectPath(path)).toBe("/dashboard")
  })
})
