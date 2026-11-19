import { describe, expect, it } from "vitest"
import { Participant, Result } from "../../../../../../../domain/types/v1api"
import { RESULT_STATUS } from "../../../../../../Results/shared/constants.ts"
import { isRunnerWithoutResult, runnersWithoutResult } from "./runnersWithoutResult.ts"

const makeParticipant = (fullName: string, stage: Partial<Result> | null): Participant => ({
  bib_number: 1,
  class: { id: "c1", long_name: "Men 21", short_name: "M-21" },
  club: { id: "cl1", short_name: "Club" },
  created: "2026-01-01T00:00:00+00:00",
  eligibility: "",
  full_name: fullName,
  id: fullName,
  is_nc: false,
  ...(stage ? { stage: { id: "res-1", created: "", ...stage } } : {}),
})

describe("isRunnerWithoutResult", () => {
  it("is true for a runner out on the course", () => {
    expect(
      isRunnerWithoutResult(
        makeParticipant("Ana Rey", { status_code: Number(RESULT_STATUS.ok), position: 0 }),
      ),
    ).toBe(true)
  })

  it("is true for a runner carrying no result at all", () => {
    expect(isRunnerWithoutResult(makeParticipant("Ana Rey", null))).toBe(true)
  })

  it("is true for nc without a finish time", () => {
    expect(
      isRunnerWithoutResult(makeParticipant("Ana Rey", { status_code: Number(RESULT_STATUS.nc) })),
    ).toBe(true)
  })

  it("is false once the runner has finished, has a position or a resolving status", () => {
    const finished = makeParticipant("Ana Rey", {
      status_code: Number(RESULT_STATUS.ok),
      finish_time: "2026-05-01T10:30:00+00:00",
    })
    const placed = makeParticipant("Ana Rey", {
      status_code: Number(RESULT_STATUS.ok),
      position: 3,
    })
    const didNotStart = makeParticipant("Ana Rey", { status_code: Number(RESULT_STATUS.dns) })
    expect([finished, placed, didNotStart].map(isRunnerWithoutResult)).toEqual([
      false,
      false,
      false,
    ])
  })

  it("reads a status sent as text", () => {
    expect(isRunnerWithoutResult(makeParticipant("Ana Rey", { status_code: "dnf" as never }))).toBe(
      false,
    )
  })
})

describe("runnersWithoutResult", () => {
  it("names each runner still in race with its class", () => {
    expect(
      runnersWithoutResult([
        makeParticipant("Ana Rey", { status_code: Number(RESULT_STATUS.ok) }),
        makeParticipant("Luis Paz", { status_code: Number(RESULT_STATUS.dnf) }),
      ]),
    ).toEqual(["Ana Rey (M-21)"])
  })
})
