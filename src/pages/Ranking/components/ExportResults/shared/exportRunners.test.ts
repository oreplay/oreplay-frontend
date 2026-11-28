import { describe, expect, it } from "vitest"
import { Participant } from "../../../../../domain/types/v1api"
import { buildExportRunners, participantPosition, topParticipantsInClass } from "./exportRunners.ts"

const makeParticipant = (over: Record<string, unknown>): Participant => ({
  bib_number: 0,
  club: { id: "c", short_name: "CLUB" },
  created: "",
  eligibility: "",
  full_name: "Runner",
  id: "id",
  is_nc: false,
  ...over,
})

describe("participantPosition", () => {
  it("prefers overall position, falls back to stage position", () => {
    expect(
      participantPosition(
        makeParticipant({ overalls: { overall: { position: 2 } }, stage: { position: 7 } }),
      ),
    ).toBe(2)
    expect(participantPosition(makeParticipant({ stage: { position: 7 } }))).toBe(7)
    expect(participantPosition(makeParticipant({}))).toBeNull()
  })
})

describe("topParticipantsInClass", () => {
  it("excludes nc and position 0/null, keeps 1..topCount (including ties), sorted", () => {
    const participants = [
      makeParticipant({ id: "a", stage: { position: 1 } }),
      makeParticipant({ id: "nc", is_nc: true, stage: { position: 2 } }),
      makeParticipant({ id: "b", stage: { position: 3 } }),
      makeParticipant({ id: "c", stage: { position: 3 } }),
      makeParticipant({ id: "d", stage: { position: 4 } }),
      makeParticipant({ id: "zero", stage: { position: 0 } }),
      makeParticipant({ id: "none", stage: {} }),
    ]
    const result = topParticipantsInClass(participants, 3)
    expect(result.map((r) => r.participant.id)).toEqual(["a", "b", "c"])
  })
})

describe("buildExportRunners", () => {
  it("flattens classes in order and maps each runner", () => {
    const runners = buildExportRunners(
      [
        {
          className: "M21",
          participants: [
            makeParticipant({
              full_name: "Ada Lovelace",
              sex: "F",
              stage: { position: 1 },
              runners: [makeParticipant({ full_name: "Team A" })],
            }),
          ],
        },
        {
          className: "W21",
          participants: [makeParticipant({ full_name: "Grace", stage: { position: 1 } })],
        },
      ],
      3,
    )
    expect(runners).toEqual([
      {
        fullname: "Ada Lovelace",
        class: "M21",
        club: "CLUB",
        participants: ["Team A"],
        sex: "F",
        position: 1,
      },
      { fullname: "Grace", class: "W21", club: "CLUB", participants: null, sex: null, position: 1 },
    ])
  })
})
