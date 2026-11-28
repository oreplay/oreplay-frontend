import { DateTime } from "luxon"
import { describe, expect, it } from "vitest"
import { RunnerModel } from "../../../../../../../../../shared/EntityTypes.ts"
import { processRunnerData } from "../../../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"
import { ONLINE_COURSE_PROGRESS } from "../../../../FootO/pages/Results/shared/onlineCourse/onlineCourse.ts"
import { withMockupRadioControls } from "../../../shared/mockupRadioControls.ts"
import { findLeg } from "../../../shared/relayLegs.ts"
import { buildRunningLegOnlineCourse } from "../../../shared/relayOnlineCourse.ts"
import { sortRelayRunners } from "../../../shared/sortRelayRunners.ts"
import { buildFakeRelayTeams, FAKE_RELAY_CLASS } from "./fakeRelayTeams.ts"

const NOW = DateTime.fromISO("2026-11-28T11:22:00.000+01:00") as DateTime<true>
const DOUBLE_PUNCH_GAP_SECONDS = 20

/**
 * Builds the fake relay and processes it like the relay results of a real class.
 *
 * @param prepare Changes the raw teams before they are processed.
 * @returns The processed teams.
 */
function processedFakeTeams(prepare: (teams: RunnerModel[]) => RunnerModel[] = (teams) => teams) {
  return processRunnerData(prepare(buildFakeRelayTeams(NOW)), [FAKE_RELAY_CLASS])
}

/**
 * Reads the punch times a leg has at each of its online splits.
 *
 * @param team Team the leg belongs to.
 * @param legNumber Number of the leg.
 * @returns The station and punch time of each online split, the finish last.
 */
function onlineReadings(team: ReturnType<typeof processedFakeTeams>[number], legNumber: number) {
  return findLeg(team, legNumber)!.stage.online_splits!.map((split) => [
    split.control?.station,
    split.reading_time,
  ])
}

describe("buildFakeRelayTeams", () => {
  it("orders the teams on the last leg by their radio punches, not by their changeover", () => {
    const names = sortRelayRunners(processedFakeTeams(), NOW).map((team) => team.full_name)

    expect(names).toEqual([
      "Norte O-Team 1",
      "Montaña Sur 1",
      "Bosque Azul",
      "Valle Verde 2",
      "Ría Club 1",
      "Sierra 1",
    ])
  })

  it("gives every leg runner the online splits of the class's radio controls, 42 twice", () => {
    const stations = processedFakeTeams()[0].runners?.[0].stage.online_splits?.map(
      (split) => split.control?.station,
    )

    expect(stations).toEqual(["40", "42", "42", "100", undefined])
  })

  it("draws the second pass at 42 as its own control on the running leg", () => {
    const team = processedFakeTeams()[0]

    const course = buildRunningLegOnlineCourse(team, findLeg(team, 3)!, null, NOW)!

    expect(course.nodes.map((node) => node.label)).toEqual([null, "40", "42", "42", "100", null])
    expect(course.nodes.map((node) => node.progress)).toEqual([
      ONLINE_COURSE_PROGRESS.Reached,
      ONLINE_COURSE_PROGRESS.Reached,
      ONLINE_COURSE_PROGRESS.Reached,
      ONLINE_COURSE_PROGRESS.Reached,
      ONLINE_COURSE_PROGRESS.Pending,
      ONLINE_COURSE_PROGRESS.Pending,
    ])
  })

  it("puts each pass at 42 in its place when the newest punch comes first", () => {
    const inOrder = onlineReadings(processedFakeTeams()[0], 1)

    const newestFirst = processedFakeTeams((teams) =>
      teams.map((team) => ({
        ...team,
        runners: team.runners?.map((leg) => ({
          ...leg,
          stage: {
            ...leg.stage,
            splits: [...leg.stage.splits]
              .reverse()
              .map((split) => ({ ...split, order_number: null })),
          },
        })),
      })),
    )

    expect(onlineReadings(newestFirst[0], 1)).toEqual(inOrder)
  })

  it("does not take a double punch at 42 for the second pass", () => {
    const withDoublePunch = (teams: RunnerModel[]) =>
      teams.map((team, index) => {
        if (index !== 0) return team
        const runningLeg = team.runners![2]
        const firstPassAt42 = runningLeg.stage.splits[1]
        const doublePunch = {
          ...firstPassAt42,
          id: "double-punch",
          reading_time: DateTime.fromISO(firstPassAt42.reading_time!)
            .plus({ seconds: DOUBLE_PUNCH_GAP_SECONDS })
            .toISO(),
        }
        const splitsWithoutSecondPass = [runningLeg.stage.splits[0], firstPassAt42, doublePunch]
        return {
          ...team,
          runners: team.runners!.map((leg) =>
            leg === runningLeg
              ? { ...leg, stage: { ...leg.stage, splits: splitsWithoutSecondPass } }
              : leg,
          ),
        }
      })
    const { classes, teams } = withMockupRadioControls(withDoublePunch(buildFakeRelayTeams(NOW)))

    const team = processRunnerData(teams, classes)[0]

    expect(onlineReadings(team, 3).map(([, readingTime]) => readingTime !== null)).toEqual([
      true,
      true,
      false,
      false,
      false,
    ])
  })
})
