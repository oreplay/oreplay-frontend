import { DateTime } from "luxon"
import {
  ClassModel,
  RunnerModel,
  SplitModel,
  StageClassModel,
  TeamRunner,
} from "../../../../../../../shared/EntityTypes.ts"

/**
 * Radio controls of the long course, in course order: 31 to 49, then 42 again and 100 before the
 * finish. A stand-in, since the backend sends no radio controls for relays.
 */
const LONG_COURSE_RADIO_STATIONS = ["40", "42", "42", "100"] as const

/**
 * Radio controls of the short course, in course order: it reaches 42 before 40, then 42 again and
 * 100 before the finish.
 */
const SHORT_COURSE_RADIO_STATIONS = ["42", "40", "42", "100"] as const

/** Classes whose legs all run the long course; every other class runs the short one. */
const LONG_COURSE_CLASS_SHORT_NAMES: readonly string[] = ["SEN", "VET A"]

/**
 * Picks the mockup radio controls of a relay class, from the course its legs run.
 *
 * @param relayClass Class of a relay team.
 * @returns The radio controls in course order, a control the course repeats listed twice.
 */
export function mockupRadioStationsOf(relayClass: ClassModel): readonly string[] {
  return LONG_COURSE_CLASS_SHORT_NAMES.includes(relayClass.short_name)
    ? LONG_COURSE_RADIO_STATIONS
    : SHORT_COURSE_RADIO_STATIONS
}

/**
 * A punch at the same radio control this soon after the previous one is the runner punching
 * twice to be sure, not a second pass, which takes the controls of a loop in between.
 */
const DOUBLE_PUNCH_SECONDS = 60

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
 * Reads the punch time of a split.
 *
 * @param split Split of a leg.
 * @returns The punch time, or `null` without one.
 */
function readingTimeOf(split: SplitModel) {
  return split.reading_time ? DateTime.fromISO(split.reading_time) : null
}

/**
 * Tells whether a radio punch repeats the previous punch at the same control within
 * `DOUBLE_PUNCH_SECONDS`.
 *
 * @param punch The radio punch to check.
 * @param previous The previous radio punch at the same control, if any.
 * @returns `true` for a double punch.
 */
function isDoublePunch(punch: SplitModel, previous: SplitModel | undefined) {
  const punchTime = readingTimeOf(punch)
  const previousTime = previous ? readingTimeOf(previous) : null
  if (!punchTime || !previousTime) return false
  return punchTime.diff(previousTime).as("seconds") < DOUBLE_PUNCH_SECONDS
}

/**
 * Drops the double punches of a leg: a radio control punched again within `DOUBLE_PUNCH_SECONDS`
 * keeps its first punch. A later punch at the same control is a second pass and is kept, as are
 * the splits of a downloaded course.
 *
 * @param splits Splits of a leg, in any order.
 * @returns The splits without the double punches, in the same order.
 */
export function withoutDoubleRadioPunches(splits: SplitModel[]): SplitModel[] {
  const punchesByTime = splits
    .filter(isRadioPunch)
    .sort((a, b) => (readingTimeOf(a)?.toMillis() ?? 0) - (readingTimeOf(b)?.toMillis() ?? 0))
  const lastKeptByStation = new Map<string, SplitModel>()
  const doublePunches = new Set<SplitModel>()
  punchesByTime.forEach((punch) => {
    const station = punch.control.station
    if (isDoublePunch(punch, lastKeptByStation.get(station))) {
      doublePunches.add(punch)
    } else {
      lastKeptByStation.set(station, punch)
    }
  })
  return splits.filter((split) => !doublePunches.has(split))
}

/**
 * Gives a leg its team's class, since the backend sends legs without one, and drops its double
 * punches.
 *
 * @param leg Runner of the leg.
 * @param teamClass Class of the team.
 * @returns The leg ready to find its radio controls.
 */
function prepareLeg(leg: TeamRunner, teamClass: ClassModel): TeamRunner {
  return {
    ...leg,
    class: leg.class ?? teamClass,
    stage: { ...leg.stage, splits: withoutDoubleRadioPunches(leg.stage.splits) },
  }
}

/**
 * Builds a class with the mockup radio controls of its course.
 *
 * @param relayClass Class of a relay team.
 * @returns The class with the radio controls `mockupRadioStationsOf` picks for it.
 */
function withMockupRadios(relayClass: ClassModel): StageClassModel {
  return {
    ...relayClass,
    splits: mockupRadioStationsOf(relayClass).map((station, index) => ({
      id: `mockup-radio-${index + 1}-${station}`,
      station,
    })),
  }
}

/**
 * Prepares relay teams from the API to show their radio punches: each leg gets its team's class
 * and loses its double punches, and every class of the teams gets the mockup radio controls.
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
