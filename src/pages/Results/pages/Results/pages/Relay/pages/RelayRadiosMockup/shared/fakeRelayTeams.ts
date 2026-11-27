import { DateTime } from "luxon"
import {
  ClassModel,
  ClubModel,
  RunnerModel,
  RunnerResultModel,
  SplitModel,
  StageClassModel,
  TeamRunner,
  UploadType,
} from "../../../../../../../../../shared/EntityTypes.ts"
import { NORMAL_CONTROL, RESULT_STATUS } from "../../../../../../../shared/constants.ts"
import { UPLOAD_TYPES } from "../../../../../shared/constants.ts"

const RADIO_STATIONS = ["40", "42", "100"] as const

const MINUTES_SINCE_MASS_START = 82

const RESULT_TYPE_ID = "e4ddfa9d-3347-47e4-9d32-c6c119aeac0e"

const FAKE_CLASS: ClassModel = { id: "fake-relay-class", long_name: "Junior", short_name: "JUN" }

/** Class of the fake relay, with its radio controls in course order. */
export const FAKE_RELAY_CLASS: StageClassModel = {
  ...FAKE_CLASS,
  splits: RADIO_STATIONS.map((station) => ({ id: `fake-control-${station}`, station })),
}

/** One fake leg: leg times at the radio controls reached, and the leg time at the finish. */
interface FakeLeg {
  finishSeconds: number | null
  name: string
  radioSeconds: number[]
  statusCode?: string
}

/** One fake team; a leg after one still out on the course is waiting for the changeover. */
interface FakeTeam {
  club: string
  legs: FakeLeg[]
  name: string
}

const FAKE_TEAMS: FakeTeam[] = [
  {
    club: "Club Norte",
    legs: [
      { finishSeconds: 1930, name: "Laura Méndez", radioSeconds: [470, 1020, 1530] },
      { finishSeconds: 1805, name: "Iker Sanz", radioSeconds: [482, 1050, 1540] },
      { finishSeconds: null, name: "Nora Pazos", radioSeconds: [475, 1030] },
    ],
    name: "Norte O-Team 1",
  },
  {
    club: "Montaña Sur",
    legs: [
      { finishSeconds: 1982, name: "Jon Ibarra", radioSeconds: [490, 1080, 1600] },
      { finishSeconds: 1910, name: "Alba Ruiz", radioSeconds: [500, 1078, 1590] },
      { finishSeconds: null, name: "Rubén Ortiz", radioSeconds: [400] },
    ],
    name: "Montaña Sur 1",
  },
  {
    club: "C.O. Bosque",
    legs: [
      { finishSeconds: 1900, name: "Carla Núñez", radioSeconds: [460, 1010, 1510] },
      { finishSeconds: 1880, name: "Diego Martín", radioSeconds: [490, 1100, 1615] },
      { finishSeconds: null, name: "Sara Gil", radioSeconds: [550] },
    ],
    name: "Bosque Azul",
  },
  {
    club: "Valle Verde",
    legs: [
      { finishSeconds: 2700, name: "Ana Torres", radioSeconds: [660, 1440, 2160] },
      { finishSeconds: null, name: "Hugo Prieto", radioSeconds: [580, 1140, 1710] },
      { finishSeconds: null, name: "Marta León", radioSeconds: [] },
    ],
    name: "Valle Verde 2",
  },
  {
    club: "Ría Club",
    legs: [
      { finishSeconds: 3150, name: "Pedro Lago", radioSeconds: [750, 1620, 2470] },
      { finishSeconds: null, name: "Elena Vidal", radioSeconds: [520, 1120] },
      { finishSeconds: null, name: "Pablo Rey", radioSeconds: [] },
    ],
    name: "Ría Club 1",
  },
  {
    club: "Sierra O",
    legs: [
      {
        finishSeconds: 2400,
        name: "Luis Campos",
        radioSeconds: [510],
        statusCode: RESULT_STATUS.mp,
      },
      { finishSeconds: null, name: "Irene Soto", radioSeconds: [540] },
      { finishSeconds: null, name: "Tomás Vega", radioSeconds: [] },
    ],
    name: "Sierra 1",
  },
]

/**
 * Builds the result of a leg or a team in the shape the results endpoint returns.
 *
 * @param fields Start, finish, time, status, upload type and splits of the result.
 * @param fields.id Identifier of the result.
 * @returns The result, with every other field at its neutral value.
 */
function buildResult(fields: {
  finishTime: DateTime | null
  id: string
  splits: SplitModel[]
  startTime: DateTime | null
  statusCode: string
  timeSeconds: number
  uploadType: UploadType
}): RunnerResultModel {
  return {
    finish_time: fields.finishTime?.toISO() ?? null,
    id: fields.id,
    points_adjusted: 0,
    points_behind: 0,
    points_bonus: 0,
    points_final: 0,
    points_penalty: 0,
    position: 0,
    result_type_id: RESULT_TYPE_ID,
    splits: fields.splits,
    start_time: fields.startTime?.toISO() ?? null,
    status_code: fields.statusCode,
    time_adjusted: 0,
    time_behind: 0,
    time_bonus: 0,
    time_neutralization: 0,
    time_penalty: 0,
    time_seconds: fields.timeSeconds,
    upload_type: fields.uploadType,
  }
}

/**
 * Builds the radio splits of a leg.
 *
 * @param legId Identifier of the leg runner, to make split ids unique.
 * @param legStart Start of the leg.
 * @param radioSeconds Leg time at each radio control reached, in course order.
 * @returns One intermediate split per radio control reached.
 */
function buildRadioSplits(legId: string, legStart: DateTime, radioSeconds: number[]) {
  return radioSeconds.map(
    (seconds, index): SplitModel => ({
      control: {
        control_type: NORMAL_CONTROL,
        id: `fake-control-${RADIO_STATIONS[index]}`,
        station: RADIO_STATIONS[index],
      },
      id: `${legId}-split-${index}`,
      is_intermediate: true,
      order_number: index + 1,
      points: null,
      reading_time: legStart.plus({ seconds }).toISO(),
    }),
  )
}

/**
 * Builds one leg runner. Unlike the backend, which sends `class: null` for a leg, the leg carries
 * its team's class, since that is how the radio controls of the leg are found.
 *
 * @param fakeLeg The leg to build.
 * @param legId Identifier of the leg runner.
 * @param legNumber Number of the leg, from 1.
 * @param club Club of the team.
 * @param legStart Start of the leg, or `null` while waiting for the changeover.
 * @returns The leg runner.
 */
function buildLeg(
  fakeLeg: FakeLeg,
  legId: string,
  legNumber: number,
  club: ClubModel,
  legStart: DateTime | null,
): TeamRunner {
  const finishTime =
    legStart && fakeLeg.finishSeconds !== null
      ? legStart.plus({ seconds: fakeLeg.finishSeconds })
      : null
  return {
    bib_number: legId,
    class: FAKE_CLASS,
    club,
    eligibility: null,
    full_name: fakeLeg.name,
    id: legId,
    is_nc: false,
    leg_number: legNumber,
    overalls: null,
    stage: buildResult({
      finishTime,
      id: `${legId}-result`,
      splits: legStart ? buildRadioSplits(legId, legStart, fakeLeg.radioSeconds) : [],
      startTime: legStart,
      statusCode: fakeLeg.statusCode ?? RESULT_STATUS.ok,
      timeSeconds: fakeLeg.finishSeconds ?? 0,
      uploadType: finishTime ? UPLOAD_TYPES.SPLIT_RESULT : UPLOAD_TYPES.ONLINE_SPLITS,
    }),
  }
}

/**
 * Builds one team, its legs starting one after another from the mass start.
 *
 * @param fakeTeam The team to build.
 * @param teamIndex Position of the team in the fake list, to make ids unique.
 * @param massStart Start of the first leg of every team.
 * @returns The team, with its leg runners in `runners`.
 */
function buildTeam(fakeTeam: FakeTeam, teamIndex: number, massStart: DateTime): RunnerModel {
  const teamId = `fake-team-${teamIndex + 1}`
  const club: ClubModel = { id: `${teamId}-club`, short_name: fakeTeam.club }
  let legStart: DateTime | null = massStart
  const runners = fakeTeam.legs.map((fakeLeg, legIndex) => {
    const leg = buildLeg(fakeLeg, `${teamId}-${legIndex + 1}`, legIndex + 1, club, legStart)
    legStart = leg.stage.finish_time ? DateTime.fromISO(leg.stage.finish_time) : null
    return leg
  })
  const hasMissingPunch = fakeTeam.legs.some((leg) => leg.statusCode === RESULT_STATUS.mp)

  return {
    bib_number: `${teamIndex + 101}`,
    class: FAKE_CLASS,
    club,
    eligibility: null,
    full_name: fakeTeam.name,
    id: teamId,
    is_nc: false,
    overalls: null,
    runners,
    stage: buildResult({
      finishTime: null,
      id: `${teamId}-result`,
      splits: [],
      startTime: massStart,
      statusCode: hasMissingPunch ? RESULT_STATUS.mp : RESULT_STATUS.ok,
      timeSeconds: 0,
      uploadType: UPLOAD_TYPES.ONLINE_SPLITS,
    }),
  }
}

/**
 * Sets the leg position and the gap to the fastest runner of every finished leg, as the results
 * of a real upload carry them.
 *
 * @param teams The teams to rank the legs of; their legs are changed in place.
 */
function rankFinishedLegs(teams: RunnerModel[]) {
  const legs = teams.flatMap((team) => team.runners ?? [])
  const legNumbers = [...new Set(legs.map((leg) => leg.leg_number))]
  legNumbers.forEach((legNumber) => {
    const finished = legs
      .filter((leg) => leg.leg_number === legNumber && leg.stage.finish_time)
      .filter((leg) => leg.stage.status_code === RESULT_STATUS.ok)
      .sort((a, b) => a.stage.time_seconds - b.stage.time_seconds)
    finished.forEach((leg, index) => {
      leg.stage.position = index + 1
      leg.stage.time_behind = leg.stage.time_seconds - finished[0].stage.time_seconds
    })
  })
}

/**
 * Builds a fake relay class in the middle of the race: six teams of three legs, the mass start
 * 82 minutes before `now`, and the radio controls 40, 42 and 100. Two teams on the last leg are
 * ordered by their radio punches the other way round than by their changeover.
 *
 * @param now The moment the race is drawn at; the live times run from it.
 * @returns The teams in the shape the results endpoint returns.
 */
export function buildFakeRelayTeams(now: DateTime): RunnerModel[] {
  const massStart = now.minus({ minutes: MINUTES_SINCE_MASS_START })
  const teams = FAKE_TEAMS.map((fakeTeam, index) => buildTeam(fakeTeam, index, massStart))
  rankFinishedLegs(teams)
  return teams
}
