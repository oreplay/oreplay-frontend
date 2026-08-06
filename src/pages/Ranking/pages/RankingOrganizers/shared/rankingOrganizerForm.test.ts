import { describe, expect, it } from "vitest"
import {
  EMPTY_RANKING_ORGANIZER_FORM,
  isRankingOrganizerFormComplete,
  toPostBody,
} from "./rankingOrganizerForm.ts"

describe("toPostBody", () => {
  it("trims the names and includes description and runner id", () => {
    expect(
      toPostBody({
        firstName: " Ada ",
        lastName: " Lovelace ",
        description: " Chief ",
        runnerId: "runner-1",
      }),
    ).toEqual({
      first_name: "Ada",
      last_name: "Lovelace",
      description: "Chief",
      runner_id: "runner-1",
    })
  })

  it("omits the blank description and runner id", () => {
    expect(
      toPostBody({ firstName: "Ada", lastName: "Lovelace", description: "   ", runnerId: "" }),
    ).toEqual({
      first_name: "Ada",
      last_name: "Lovelace",
      description: undefined,
      runner_id: undefined,
    })
  })
})

describe("isRankingOrganizerFormComplete", () => {
  it("requires both first and last name", () => {
    expect(isRankingOrganizerFormComplete(EMPTY_RANKING_ORGANIZER_FORM)).toBe(false)
    expect(
      isRankingOrganizerFormComplete({
        firstName: "Ada",
        lastName: "",
        description: "",
        runnerId: "",
      }),
    ).toBe(false)
    expect(
      isRankingOrganizerFormComplete({
        firstName: " ",
        lastName: "Lovelace",
        description: "",
        runnerId: "",
      }),
    ).toBe(false)
    expect(
      isRankingOrganizerFormComplete({
        firstName: "Ada",
        lastName: "Lovelace",
        description: "",
        runnerId: "",
      }),
    ).toBe(true)
  })
})
