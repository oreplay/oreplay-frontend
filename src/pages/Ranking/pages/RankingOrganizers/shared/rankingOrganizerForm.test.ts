import { describe, expect, it } from "vitest"
import {
  EMPTY_RANKING_ORGANIZER_FORM,
  isRankingOrganizerFormComplete,
  toPostBody,
} from "./rankingOrganizerForm.ts"

describe("toPostBody", () => {
  it("trims the names and includes a non-empty description", () => {
    expect(
      toPostBody({ firstName: " Ada ", lastName: " Lovelace ", description: " Chief " }),
    ).toEqual({ first_name: "Ada", last_name: "Lovelace", description: "Chief" })
  })

  it("omits the description when it is blank", () => {
    expect(toPostBody({ firstName: "Ada", lastName: "Lovelace", description: "   " })).toEqual({
      first_name: "Ada",
      last_name: "Lovelace",
      description: undefined,
    })
  })
})

describe("isRankingOrganizerFormComplete", () => {
  it("requires both first and last name", () => {
    expect(isRankingOrganizerFormComplete(EMPTY_RANKING_ORGANIZER_FORM)).toBe(false)
    expect(
      isRankingOrganizerFormComplete({ firstName: "Ada", lastName: "", description: "" }),
    ).toBe(false)
    expect(
      isRankingOrganizerFormComplete({ firstName: " ", lastName: "Lovelace", description: "" }),
    ).toBe(false)
    expect(
      isRankingOrganizerFormComplete({ firstName: "Ada", lastName: "Lovelace", description: "" }),
    ).toBe(true)
  })
})
