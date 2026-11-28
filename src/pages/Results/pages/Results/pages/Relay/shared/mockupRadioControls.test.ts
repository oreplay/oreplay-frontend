import { describe, expect, it } from "vitest"
import { RunnerModel, SplitModel, TeamRunner } from "../../../../../../../shared/EntityTypes.ts"
import { NORMAL_CONTROL } from "../../../../../shared/constants.ts"
import {
  mockupRadioStationsOf,
  withMockupRadioControls,
  withoutDoubleRadioPunches,
} from "./mockupRadioControls.ts"
import { baseLegFixture, baseRelayRunnerFixture } from "./relayFixtures.ts"

const EARLIER_PUNCH = "2026-11-27T22:28:04.000+00:00"
const LATER_PUNCH = "2026-11-27T22:28:32.000+00:00"
const SECOND_PASS_PUNCH = "2026-11-27T22:36:10.000+00:00"
const SECOND_PASS_AGAIN_PUNCH = "2026-11-27T22:36:20.000+00:00"

/**
 * Builds a split for these tests.
 *
 * @param id Identifier of the split.
 * @param station Station of the control.
 * @param readingTime Punch time, as ISO 8601.
 * @param orderNumber Place in a downloaded course, or `null` for a radio punch.
 * @returns The split.
 */
function buildSplit(
  id: string,
  station: string,
  readingTime: string,
  orderNumber: number | null,
): SplitModel {
  return {
    control: { control_type: NORMAL_CONTROL, id: `control-${station}`, station },
    id,
    is_intermediate: true,
    order_number: orderNumber,
    points: null,
    reading_time: readingTime,
  }
}

describe("withoutDoubleRadioPunches", () => {
  it("keeps only the first punch of a double punch at a radio control", () => {
    const later = buildSplit("later", "42", LATER_PUNCH, null)
    const earlier = buildSplit("earlier", "42", EARLIER_PUNCH, null)

    expect(withoutDoubleRadioPunches([later, earlier])).toEqual([earlier])
  })

  it("keeps a second pass at a radio control the course repeats", () => {
    const firstPass = buildSplit("first", "42", EARLIER_PUNCH, null)
    const secondPass = buildSplit("second", "42", SECOND_PASS_PUNCH, null)

    expect(withoutDoubleRadioPunches([secondPass, firstPass])).toEqual([secondPass, firstPass])
  })

  it("drops a double punch at the second pass too", () => {
    const firstPass = buildSplit("first", "42", EARLIER_PUNCH, null)
    const secondPass = buildSplit("second", "42", SECOND_PASS_PUNCH, null)
    const secondPassAgain = buildSplit("again", "42", SECOND_PASS_AGAIN_PUNCH, null)

    expect(withoutDoubleRadioPunches([firstPass, secondPass, secondPassAgain])).toEqual([
      firstPass,
      secondPass,
    ])
  })

  it("keeps a control repeated in a downloaded course", () => {
    const firstPass = buildSplit("first", "42", EARLIER_PUNCH, 12)
    const secondPass = buildSplit("second", "42", LATER_PUNCH, 20)

    expect(withoutDoubleRadioPunches([firstPass, secondPass])).toEqual([firstPass, secondPass])
  })
})

describe("mockupRadioStationsOf", () => {
  const LONG_COURSE = ["40", "42", "42", "100"]
  const SHORT_COURSE = ["42", "40", "42", "100"]

  it.each([
    ["SEN", LONG_COURSE],
    ["VET A", LONG_COURSE],
    ["XUV", SHORT_COURSE],
    ["INF", SHORT_COURSE],
    ["VET B", SHORT_COURSE],
  ])("gives %s the radio controls of its course", (shortName, stations) => {
    const relayClass = { id: shortName, long_name: shortName, short_name: shortName }

    expect(mockupRadioStationsOf(relayClass)).toEqual(stations)
  })
})

describe("withMockupRadioControls", () => {
  const leg = {
    ...baseLegFixture,
    stage: { ...baseLegFixture.stage, splits: [] },
  } as unknown as TeamRunner
  const team = { ...baseRelayRunnerFixture, runners: [leg] } as unknown as RunnerModel

  it("gives every class of the teams the mockup radio controls", () => {
    const { classes } = withMockupRadioControls([team, team])

    expect(classes).toHaveLength(1)
    expect(classes[0].id).toBe(team.class.id)
    expect(classes[0].splits.map((control) => control.station)).toEqual(
      mockupRadioStationsOf(team.class),
    )
  })

  it("gives a leg without a class the class of its team", () => {
    const { teams } = withMockupRadioControls([team])

    expect(teams[0].runners?.[0].class).toEqual(team.class)
  })
})
