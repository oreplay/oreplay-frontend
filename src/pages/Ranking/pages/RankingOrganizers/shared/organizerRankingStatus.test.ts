import { describe, expect, it } from "vitest"
import { Participant, PartialOverall } from "../../../../../domain/types/v1api"
import {
  isOrganizerRemovable,
  ORGANIZER_RANKING_STATUSES,
  organizerRankingStatus,
  organizerSearchText,
} from "./organizerRankingStatus.ts"

const makePart = (stageOrder: number): PartialOverall => ({
  id: `part-${stageOrder}`,
  points_final: 100,
  position: 1,
  stage_order: stageOrder,
  status_code: 0,
  upload_type: "total_points",
})

const makeParticipant = (id: string, stageOrders: number[]): Participant => ({
  bib_number: 1,
  club: { id: "club-1", short_name: "Club" },
  created: "2026-01-01T00:00:00+00:00",
  eligibility: "",
  full_name: "Felipe Peña Pita",
  id,
  is_nc: false,
  overalls: { parts: stageOrders.map(makePart) },
})

describe("organizerRankingStatus", () => {
  const participants = [makeParticipant("other", [2]), makeParticipant("runner-1", [1, 3])]

  it("is missing when the organizer has no runner_id", () => {
    expect(
      organizerRankingStatus({ runnerId: null, participants, isChecking: true, stageOrder: 2 }),
    ).toBe("missing")
  })

  it("is checking while the results or the stage order are still loading", () => {
    expect(
      organizerRankingStatus({
        runnerId: "runner-1",
        participants,
        isChecking: true,
        stageOrder: 2,
      }),
    ).toBe("checking")
    expect(organizerRankingStatus({ runnerId: "runner-1", participants, isChecking: false })).toBe(
      "checking",
    )
  })

  it("is missing when the runner is not among the ranking results", () => {
    expect(
      organizerRankingStatus({
        runnerId: "absent",
        participants,
        isChecking: false,
        stageOrder: 2,
      }),
    ).toBe("missing")
  })

  it("is inStage when the runner has a part for the stage order", () => {
    expect(
      organizerRankingStatus({
        runnerId: "runner-1",
        participants,
        isChecking: false,
        stageOrder: 3,
      }),
    ).toBe("inStage")
  })

  it("is addable when the runner has no part for the stage order", () => {
    expect(
      organizerRankingStatus({
        runnerId: "runner-1",
        participants,
        isChecking: false,
        stageOrder: 2,
      }),
    ).toBe("addable")
  })
})

describe("isOrganizerRemovable", () => {
  it("allows removing only an organizer that is addable or missing", () => {
    expect(ORGANIZER_RANKING_STATUSES.filter(isOrganizerRemovable)).toEqual(["addable", "missing"])
  })
})

describe("organizerSearchText", () => {
  it("searches by last name, since the results search does not match a full name", () => {
    expect(organizerSearchText({ first_name: "Felipe", last_name: " Peña Pita " })).toBe(
      "Peña Pita",
    )
  })

  it("falls back to the first name when there is no last name", () => {
    expect(organizerSearchText({ first_name: "Felipe", last_name: "" })).toBe("Felipe")
  })
})
