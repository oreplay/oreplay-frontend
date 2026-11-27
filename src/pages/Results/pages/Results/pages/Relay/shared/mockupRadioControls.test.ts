import { describe, expect, it } from "vitest"
import { RunnerModel, SplitModel, TeamRunner } from "../../../../../../../shared/EntityTypes.ts"
import { NORMAL_CONTROL } from "../../../../../shared/constants.ts"
import {
  firstRadioPunchPerStation,
  MOCKUP_RADIO_STATIONS,
  withMockupRadioControls,
} from "./mockupRadioControls.ts"
import { baseLegFixture, baseRelayRunnerFixture } from "./relayFixtures.ts"

const EARLIER_PUNCH = "2026-11-27T22:28:04.000+00:00"
const LATER_PUNCH = "2026-11-27T22:28:32.000+00:00"

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

describe("firstRadioPunchPerStation", () => {
  it("keeps only the first punch at a radio control punched twice", () => {
    const later = buildSplit("later", "42", LATER_PUNCH, null)
    const earlier = buildSplit("earlier", "42", EARLIER_PUNCH, null)

    expect(firstRadioPunchPerStation([later, earlier])).toEqual([earlier])
  })

  it("keeps a control repeated in a downloaded course", () => {
    const firstPass = buildSplit("first", "42", EARLIER_PUNCH, 1)
    const secondPass = buildSplit("second", "42", LATER_PUNCH, 5)

    expect(firstRadioPunchPerStation([firstPass, secondPass])).toEqual([firstPass, secondPass])
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
    expect(classes[0].splits.map((control) => control.station)).toEqual([...MOCKUP_RADIO_STATIONS])
  })

  it("gives a leg without a class the class of its team", () => {
    const { teams } = withMockupRadioControls([team])

    expect(teams[0].runners?.[0].class).toEqual(team.class)
  })
})
