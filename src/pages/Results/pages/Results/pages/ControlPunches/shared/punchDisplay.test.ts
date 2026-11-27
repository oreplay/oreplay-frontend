import { describe, expect, it } from "vitest"
import { Participant } from "../../../../../../../domain/types/v1api"
import { formatPunchClockTime, formatPunchElapsedTime, getPunchSubtitle } from "./punchDisplay.ts"

const RUNNER: Participant = {
  id: "runner-1",
  full_name: "Hugo Varela",
  bib_number: 201,
  club: { id: "club-1", short_name: "Navia O" },
  class: { id: "class-m21", short_name: "M21", long_name: "Men 21" },
  created: "2026-11-27T08:00:00.000+00:00",
  eligibility: "",
  is_nc: false,
}

describe("formatPunchElapsedTime", () => {
  it("formats the seconds since the start", () => {
    expect(formatPunchElapsedTime(1385)).toBe("23:05")
  })

  it("shows nothing when the start is unknown", () => {
    expect(formatPunchElapsedTime(null)).toBeNull()
  })
})

describe("formatPunchClockTime", () => {
  it("shows the punch time in the viewer's time zone", () => {
    expect(formatPunchClockTime("2026-11-27T10:33:05.000+01:00")).toBe("09:33:05")
  })
})

describe("getPunchSubtitle", () => {
  it("joins class and club", () => {
    expect(getPunchSubtitle(RUNNER, "No club")).toBe("M21 · Navia O")
  })

  it("shows the no-club label for a runner without club", () => {
    const runnerWithoutClub = { ...RUNNER, club: null } as unknown as Participant

    expect(getPunchSubtitle(runnerWithoutClub, "No club")).toBe("M21 · No club")
  })

  it("leaves out a missing class", () => {
    expect(getPunchSubtitle({ ...RUNNER, class: null }, "No club")).toBe("Navia O")
  })
})
