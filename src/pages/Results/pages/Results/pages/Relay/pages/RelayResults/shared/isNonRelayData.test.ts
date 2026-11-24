import { describe, expect, it } from "vitest"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { baseLegFixture, baseRelayRunnerFixture } from "../../../shared/relayFixtures.ts"
import { isNonRelayData } from "./isNonRelayData.ts"

const START_TIME = "2025-10-26T09:00:00.000+00:00"
const FINISH_TIME = "2025-10-26T10:00:00.000+00:00"

const relayTeam: ProcessedRunnerModel = {
  ...baseRelayRunnerFixture,
  id: "relay-team",
  stage: { ...baseRelayRunnerFixture.stage, start_time: START_TIME },
  runners: [baseLegFixture],
}

const vacantTeam: ProcessedRunnerModel = {
  ...baseRelayRunnerFixture,
  id: "vacant-team",
  runners: [],
}

const startedIndividual: ProcessedRunnerModel = {
  ...baseRelayRunnerFixture,
  id: "started-individual",
  stage: { ...baseRelayRunnerFixture.stage, start_time: START_TIME },
  runners: [],
}

const finishedIndividual: ProcessedRunnerModel = {
  ...baseRelayRunnerFixture,
  id: "finished-individual",
  stage: { ...baseRelayRunnerFixture.stage, finish_time: FINISH_TIME },
  runners: null,
}

describe("isNonRelayData", () => {
  it("flags teams that raced without any leg runner", () => {
    expect(isNonRelayData([startedIndividual, finishedIndividual, vacantTeam])).toBe(true)
  })

  it("flags a team without runners at all", () => {
    expect(isNonRelayData([{ ...finishedIndividual, runners: undefined }])).toBe(true)
  })

  it("accepts a list that has at least one team with members", () => {
    expect(isNonRelayData([relayTeam, startedIndividual, vacantTeam])).toBe(false)
  })

  it("accepts a list of vacant teams only", () => {
    expect(isNonRelayData([vacantTeam, { ...vacantTeam, id: "other-vacant-team" }])).toBe(false)
  })

  it("accepts an empty list", () => {
    expect(isNonRelayData([])).toBe(false)
  })
})
