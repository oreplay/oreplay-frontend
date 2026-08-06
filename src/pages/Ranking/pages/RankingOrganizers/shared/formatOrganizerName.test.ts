import { describe, expect, it } from "vitest"
import { formatOrganizerName } from "./formatOrganizerName.ts"

describe("formatOrganizerName", () => {
  it("joins first and last name", () => {
    expect(formatOrganizerName("Ada", "Lovelace")).toBe("Ada Lovelace")
  })

  it("trims when a part is missing", () => {
    expect(formatOrganizerName("Ada", "")).toBe("Ada")
  })
})
