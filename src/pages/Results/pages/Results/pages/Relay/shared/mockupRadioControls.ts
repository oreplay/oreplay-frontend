import { DateTime } from "luxon"
import {
  ClassModel,
  RunnerModel,
  SplitModel,
  StageClassModel,
  TeamRunner,
} from "../../../../../../../shared/EntityTypes.ts"

/**
 * Radio controls every relay class gets, in course order, while the backend sends none for
 * relays: a stand-in to see the relay radios with real punches.
 */
export const MOCKUP_RADIO_STATIONS = ["40", "42", "100"] as const

/**
 * Tells whether a split is a radio punch: read online, with no place in a downloaded course.
 *
 * @param split Split of a leg.
 * @returns `true` for an intermediate split without an order number.
 */
function isRadioPunch(split: SplitModel) {
  return split.is_intermediate && split.order_number === null
}

/**
 * Reads the punch time of a split as milliseconds, so two punches can be compared.
 *
 * @param split Split with a punch time.
 * @returns The punch time in milliseconds, or `Infinity` without one.
 */
function readingMillis(split: SplitModel) {
  return split.reading_time ? DateTime.fromISO(split.reading_time).toMillis() : Infinity
}

/**
 * Keeps one radio punch per control: the first, since a runner who punches a radio control twice
 * passed it once. Splits of a downloaded course are kept as they are, repeated controls included.
 *
 * @param splits Splits of a leg.
 * @returns The splits, without the later punches at a radio control already punched.
 */
export function firstRadioPunchPerStation(splits: SplitModel[]): SplitModel[] {
  const firstByStation = new Map<string, SplitModel>()
  splits.filter(isRadioPunch).forEach((split) => {
    const first = firstByStation.get(split.control.station)
    if (!first || readingMillis(split) < readingMillis(first)) {
      firstByStation.set(split.control.station, split)
    }
  })
  return splits.filter(
    (split) => !isRadioPunch(split) || firstByStation.get(split.control.station) === split,
  )
}

/**
 * Gives a leg its team's class, since the backend sends legs without one, and drops its repeated
 * radio punches.
 *
 * @param leg Runner of the leg.
 * @param teamClass Class of the team.
 * @returns The leg ready to find its radio controls.
 */
function prepareLeg(leg: TeamRunner, teamClass: ClassModel): TeamRunner {
  return {
    ...leg,
    class: leg.class ?? teamClass,
    stage: { ...leg.stage, splits: firstRadioPunchPerStation(leg.stage.splits) },
  }
}

/**
 * Builds a class with the mockup radio controls.
 *
 * @param relayClass Class of a relay team.
 * @returns The class with `MOCKUP_RADIO_STATIONS` as its radio controls.
 */
function withMockupRadios(relayClass: ClassModel): StageClassModel {
  return {
    ...relayClass,
    splits: MOCKUP_RADIO_STATIONS.map((station) => ({ id: `mockup-radio-${station}`, station })),
  }
}

/**
 * Prepares relay teams from the API to show their radio punches: each leg gets its team's class
 * and keeps one punch per radio control, and every class of the teams gets the mockup radio
 * controls.
 *
 * @param teams Relay teams as the results endpoint returns them.
 * @returns The prepared teams, and their classes with the mockup radio controls.
 */
export function withMockupRadioControls(teams: RunnerModel[]): {
  classes: StageClassModel[]
  teams: RunnerModel[]
} {
  const classesById = new Map(teams.map((team) => [team.class.id, withMockupRadios(team.class)]))
  return {
    classes: [...classesById.values()],
    teams: teams.map((team) => ({
      ...team,
      runners: team.runners?.map((leg) => prepareLeg(leg, team.class)),
    })),
  }
}
