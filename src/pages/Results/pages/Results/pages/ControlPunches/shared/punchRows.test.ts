import { describe, expect, it } from "vitest"
import { ControlPunch, Participant, Split } from "../../../../../../../domain/types/v1api"
import { getElapsedSeconds, PunchRow, toPunchRows } from "./punchRows.ts"

const READING_TIME = "2026-11-27T10:33:05.000+01:00"

const SPLIT: Split = { id: "split-1", station: 31, reading_time: READING_TIME }

const RUNNER: Participant = {
  id: "runner-1",
  full_name: "Hugo Varela",
  bib_number: 201,
  club: { id: "club-1", short_name: "Navia O" },
  class: { id: "class-m21", short_name: "M21", long_name: "Men 21" },
  created: "2026-11-27T08:00:00.000+00:00",
  eligibility: "",
  is_nc: false,
  stage: { id: "result-1", created: "", start_time: "2026-11-27T10:10:00.000+01:00" },
}

const TEAM: Participant = {
  ...RUNNER,
  id: "team-1",
  full_name: "Navia O 1",
  stage: { id: "result-team-1", created: "", start_time: "2026-11-27T10:00:00.000+01:00" },
}

describe("getElapsedSeconds", () => {
  it("counts whole seconds from the start to the punch", () => {
    expect(
      getElapsedSeconds("2026-11-27T10:10:00.000+01:00", "2026-11-27T10:33:05.900+01:00"),
    ).toBe(1385)
  })

  it("is unknown without a start", () => {
    expect(getElapsedSeconds(undefined, READING_TIME)).toBeNull()
  })

  it("is unknown for a punch before the start", () => {
    expect(getElapsedSeconds("2026-11-27T11:00:00.000+01:00", READING_TIME)).toBeNull()
  })
})

describe("toPunchRows", () => {
  it("shows an individual punch with the runner", () => {
    const punches: ControlPunch[] = [{ split: SPLIT, runner: RUNNER }]
    const expected: PunchRow[] = [
      {
        elapsedSeconds: 1385,
        id: "split-1",
        participant: RUNNER,
        readingTime: READING_TIME,
        teamMemberName: null,
      },
    ]

    expect(toPunchRows(punches)).toEqual(expected)
  })

  it("shows a relay leg's punch as its team, with the leg runner's name and start", () => {
    const punches: ControlPunch[] = [{ split: SPLIT, runner: RUNNER, team: TEAM }]
    const expected: PunchRow[] = [
      {
        elapsedSeconds: 1385,
        id: "split-1",
        participant: TEAM,
        readingTime: READING_TIME,
        teamMemberName: "Hugo Varela",
      },
    ]

    expect(toPunchRows(punches)).toEqual(expected)
  })

  it("shows a punch of the team itself, timed from the team's start", () => {
    const punches: ControlPunch[] = [{ split: SPLIT, team: TEAM }]

    expect(toPunchRows(punches)[0]).toMatchObject({ participant: TEAM, elapsedSeconds: 1985 })
  })

  it("leaves out punches without split, punch time or participant", () => {
    const punches: ControlPunch[] = [
      { runner: RUNNER },
      { split: { id: "split-2" }, runner: RUNNER },
      { split: SPLIT },
    ]

    expect(toPunchRows(punches)).toEqual([])
  })
})
