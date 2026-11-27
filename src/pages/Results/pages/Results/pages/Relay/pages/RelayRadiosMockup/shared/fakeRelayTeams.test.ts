import { DateTime } from "luxon"
import { describe, expect, it } from "vitest"
import { processRunnerData } from "../../../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"
import { sortRelayRunners } from "../../../shared/sortRelayRunners.ts"
import { buildFakeRelayTeams, FAKE_RELAY_CLASS } from "./fakeRelayTeams.ts"

const NOW = DateTime.fromISO("2026-11-28T11:22:00.000+01:00") as DateTime<true>

describe("buildFakeRelayTeams", () => {
  it("orders the teams on the last leg by their radio punches, not by their changeover", () => {
    const teams = processRunnerData(buildFakeRelayTeams(NOW), [FAKE_RELAY_CLASS])

    const names = sortRelayRunners(teams, NOW).map((team) => team.full_name)

    expect(names).toEqual([
      "Norte O-Team 1",
      "Montaña Sur 1",
      "Bosque Azul",
      "Valle Verde 2",
      "Ría Club 1",
      "Sierra 1",
    ])
  })

  it("gives every leg runner the online splits of the class's radio controls", () => {
    const teams = processRunnerData(buildFakeRelayTeams(NOW), [FAKE_RELAY_CLASS])

    const stations = teams[0].runners?.[0].stage.online_splits?.map(
      (split) => split.control?.station,
    )

    expect(stations).toEqual(["40", "42", "100", undefined])
  })
})
