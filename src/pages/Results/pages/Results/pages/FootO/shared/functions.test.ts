import { describe, it, expect, vi } from "vitest"
import { sortRunners } from "../../../../../shared/sortingFunctions/sortRunners.ts"
import { RESULT_STATUS } from "../../../../../shared/constants.ts"
import { sortFootORunners } from "./functions.ts"
import { DateTime } from "luxon"

describe("sortRunners and sortFootORunners", () => {
  it("should handle different classification statuses", () => {
    const baseRunner = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "string",
        short_name: "string",
        long_name: "string",
      },
      club: {
        id: "string",
        short_name: "string",
      },
      full_name: "string",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_splits",
        time_seconds: 420,
        position: 2,
        status_code: RESULT_STATUS.ok,
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [],
        online_splits: [],
      },
      overalls: null,
    }

    const runnerStatusOK = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: RESULT_STATUS.ok },
    }

    const runnerStatusDNS = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: RESULT_STATUS.dns },
    }

    const runnerStatusDNF = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: RESULT_STATUS.dnf },
    }

    const runnerStatusMP = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: RESULT_STATUS.mp },
    }

    const runnerStatusDSQ = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: RESULT_STATUS.dsq },
    }

    const runnerStatusOT = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: RESULT_STATUS.ot },
    }

    const runnerStatusNC = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: RESULT_STATUS.nc },
    }

    const runnerList = [
      runnerStatusDNS,
      runnerStatusOK,
      runnerStatusNC,
      runnerStatusDNF,
      runnerStatusMP,
      runnerStatusOT,
      runnerStatusDSQ,
    ]

    const expected = [
      runnerStatusOK,
      runnerStatusNC,
      runnerStatusOT,
      runnerStatusMP,
      runnerStatusDNF,
      runnerStatusDSQ,
      runnerStatusDNS,
    ]

    expect(sortRunners(runnerList), "Failed regular runners").toEqual(expected)
    expect(sortFootORunners(runnerList), "Failed footO runners").toEqual(expected)
  })

  it("should handle nc", () => {
    const baseRunner = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "string",
        short_name: "string",
        long_name: "string",
      },
      club: {
        id: "string",
        short_name: "string",
      },
      full_name: "string",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_splits",
        time_seconds: 420,
        position: 2,
        status_code: RESULT_STATUS.ok,
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [],
        online_splits: [],
      },
      overalls: null,
    }

    const runnerOK = {
      ...baseRunner,
      full_name: "string1",
      is_nc: false,
      stage: {
        ...baseRunner.stage,
        time_seconds: 400,
      },
    }

    const runnerNC = {
      ...baseRunner,
      full_name: "string nc",
      is_nc: true,
      stage: {
        ...baseRunner.stage,
        time_seconds: 400,
      },
    }

    const runnerAlsoOK = {
      ...baseRunner,
      full_name: "string2",
      is_nc: false,
      stage: {
        ...baseRunner.stage,
        position: 3,
        time_seconds: 420,
      },
    }
    const runnerList = [runnerNC, runnerOK, runnerAlsoOK]

    const expected = [
      runnerOK,
      runnerNC, // NC at the same level that the OK
      runnerAlsoOK,
    ]

    expect(sortRunners(runnerList), "Failed regular runners").toEqual(expected)
    expect(sortFootORunners(runnerList), "Failed footO runners").toEqual(expected)
  })

  it("should handle in-race runners mixed with finished runners", () => {
    const baseRunner = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "string",
        short_name: "short name",
        long_name: "long name",
      },
      club: {
        id: "string",
        short_name: "club name",
      },
      full_name: "Base Runner",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: "2025-06-27T09:07:00.000+00:00",
        upload_type: "res_splits",
        time_seconds: 420,
        position: 2,
        status_code: RESULT_STATUS.ok,
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [],
        online_splits: [],
      },
      overalls: null,
    }

    const runnerFinished1 = {
      ...baseRunner,
      full_name: "Runner Finished 1",
      stage: {
        ...baseRunner.stage,
        finish_time: "2025-06-27T09:07:00.000+00:00",
        position: 1,
      },
    }

    const runnerStillRunning = {
      ...baseRunner,
      full_name: "Runner Still Running",
      stage: {
        ...baseRunner.stage,
        finish_time: null,
        position: 0,
      },
    }

    const runnerFinished2 = {
      ...baseRunner,
      full_name: "Runner Finished 2",
      stage: {
        ...baseRunner.stage,
        finish_time: "2025-06-27T09:08:00.000+00:00",
        position: 2,
      },
    }
    const runnerFinished3 = {
      ...baseRunner,
      full_name: "Runner Finished 3",
      stage: {
        ...baseRunner.stage,
        finish_time: "2025-06-27T09:09:00.000+00:00",
        position: 3,
      },
    }

    const runnerFinished4 = {
      ...baseRunner,
      full_name: "Runner Finished 4",
      stage: {
        ...baseRunner.stage,
        finish_time: "2025-06-27T09:10:00.000+00:00",
        position: 4,
      },
    }

    const runnerStillRunning2 = {
      ...baseRunner,
      full_name: "Runner Still Running 2",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T10:00:00.000+00:00",
        finish_time: null,
        position: 0,
      },
    }

    const runnerList = [
      runnerStillRunning,
      runnerFinished1,
      runnerFinished2,
      runnerStillRunning2,
      runnerFinished4,
      runnerFinished3,
    ]

    const expected = [
      runnerFinished1,
      runnerFinished2,
      runnerFinished3,
      runnerFinished4,
      runnerStillRunning2,
      runnerStillRunning,
    ]

    expect(sortRunners(runnerList), "Failed regular runners").toEqual(expected)
    expect(sortFootORunners(runnerList), "Failed FootO runners").toEqual(expected)
  })

  it("should handle runners without start time (they should be at the end)", () => {
    const baseRunner = {
      id: "string",
      bib_number: "1234",
      is_nc: false,
      eligibility: null,
      sicard: "12345678",
      sex: "M",
      class: {
        id: "string",
        short_name: "short name",
        long_name: "long name",
      },
      club: {
        id: "string",
        short_name: "club name",
      },
      full_name: "Base Runner",
      stage: {
        id: "string",
        result_type_id: "string",
        start_time: "2025-06-27T09:00:00.000+00:00",
        finish_time: null,
        upload_type: "res_splits",
        time_seconds: 420,
        position: 0,
        status_code: "2",
        time_behind: 0,
        time_neutralization: 0,
        time_adjusted: 0,
        time_penalty: 0,
        time_bonus: 0,
        points_final: 0,
        points_adjusted: 0,
        points_penalty: 0,
        points_bonus: 0,
        leg_number: 1,
        splits: [],
        online_splits: [],
      },
      overalls: null,
    }

    const runnerWithStartTime = {
      ...baseRunner,
      full_name: "Runner With Start",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:00:00.000+00:00",
      },
    }

    const runnerWithoutStartTime = {
      ...baseRunner,
      full_name: "Runner No Start",
      stage: {
        ...baseRunner.stage,
        start_time: null,
      },
    }

    const runnerWithStartTime2 = {
      ...baseRunner,
      full_name: "Runner With Start 2",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:05:00.000+00:00",
      },
    }

    const runnerList = [runnerWithoutStartTime, runnerWithStartTime2, runnerWithStartTime]

    const expected = [runnerWithStartTime2, runnerWithStartTime, runnerWithoutStartTime]

    expect(sortRunners(runnerList)).toEqual(expected)
    expect(sortFootORunners(runnerList)).toEqual(expected)
  })
})

describe("sortFootORunners with detailed online_splits", () => {
  vi.spyOn(DateTime, "now").mockReturnValue(
    DateTime.fromISO("2025-06-27T10:00:00.000+00:00") as DateTime<true>,
  )

  const defaultIsNext = DateTime.fromISO("1970-01-01T00:00:00.000+00:00")

  const baseRunner = {
    id: "runner1",
    bib_number: "1000",
    is_nc: false,
    eligibility: null,
    sicard: "11111111",
    sex: "M",
    class: { id: "1", short_name: "M21", long_name: "Men 21 Elite" },
    club: { id: "1", short_name: "ClubA" },
    full_name: "Runner",
    stage: {
      id: "s1",
      result_type_id: "res",
      start_time: "2025-06-27T09:50:00.000+00:00",
      finish_time: null,
      upload_type: "res_splits",
      time_seconds: 0,
      position: 0,
      status_code: "0",
      time_behind: 0,
      time_neutralization: 0,
      time_adjusted: 0,
      time_penalty: 0,
      time_bonus: 0,
      points_final: 0,
      points_adjusted: 0,
      points_penalty: 0,
      points_bonus: 0,
      leg_number: 1,
      splits: [],
      online_splits: [],
    },
    overalls: null,
  }

  function makeSplit(order_number: number, station: string | null, cumulative_time: number | null) {
    return {
      id: `split${order_number}`,
      is_intermediate: true,
      reading_time: cumulative_time
        ? DateTime.fromISO("2025-06-27T09:50:00.000+00:00")
            .plus({ seconds: cumulative_time })
            .toISO()
        : null,
      points: 0,
      time_behind: 0,
      position: 0,
      cumulative_position: 0,
      cumulative_behind: 0,
      cumulative_time: cumulative_time,
      order_number: order_number,
      control: station
        ? {
            id: `c${order_number}`,
            station,
            control_type: { id: "ctrl-type-1", description: "Normal Control" },
          }
        : null,
      time: cumulative_time, //TODO: This is wrong
      status_code: "0",
      leg_number: 1,
      is_next: defaultIsNext, //TODO: This is wrong
    }
  }

  it("should sort runners by last shared control cumulative_time", () => {
    const runnerA = {
      ...baseRunner,
      id: "A",
      full_name: "Runner A",
      stage: {
        ...baseRunner.stage,
        online_splits: [
          makeSplit(31, "31", 8 * 60),
          makeSplit(32, "32", 10 * 60),
          makeSplit(33, "33", 12 * 60),
        ],
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerB = {
      ...baseRunner,
      id: "B",
      full_name: "Runner B",
      stage: {
        ...baseRunner.stage,
        online_splits: [makeSplit(31, "31", 4 * 60)],
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const sorted = sortFootORunners([runnerA, runnerB])
    const expected = [runnerB, runnerA] // B ahead because faster at last shared control

    expect(sorted).toEqual(expected)
  })

  it("should sort runners correctly when one has more controls but is slower at last shared control", () => {
    const runnerA = {
      ...baseRunner,
      id: "A",
      full_name: "Runner A",
      stage: {
        ...baseRunner.stage,
        online_splits: [
          makeSplit(31, "31", 8 * 60),
          makeSplit(32, "32", 10 * 60),
          makeSplit(33, "33", 12 * 60),
        ],
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerB = {
      //TODO: They always have the same number of splits but they are empty
      ...baseRunner,
      id: "B",
      full_name: "Runner B",
      stage: {
        ...baseRunner.stage,
        online_splits: [makeSplit(31, "31", 4 * 60), makeSplit(32, "32", 9 * 60)],
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const sorted = sortFootORunners([runnerA, runnerB])
    const expected = [runnerB, runnerA] // B ahead because faster at last shared control 32

    expect(sorted).toEqual(expected)
  })

  it("should put finished runner by position but allow faster in-race runner ahead", () => {
    const runnerFinished = {
      ...baseRunner,
      id: "F",
      full_name: "Runner Finished",
      stage: {
        ...baseRunner.stage,
        online_splits: [
          makeSplit(31, "31", 8 * 60),
          makeSplit(32, "32", 10 * 60),
          makeSplit(33, "33", 12 * 60),
        ],
        finish_time: "2025-06-27T09:58:00.000+00:00",
        position: 1,
        status_code: "0",
      },
    }

    const runnerInProgressFast = {
      ...baseRunner,
      id: "I",
      full_name: "Runner In Progress Fast",
      stage: {
        ...baseRunner.stage,
        online_splits: [makeSplit(31, "31", 4 * 60)], //TODO: Add empty splits
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerInProgressSlow = {
      ...baseRunner,
      id: "S",
      full_name: "Runner In Progress Slow",
      stage: {
        ...baseRunner.stage,
        online_splits: [makeSplit(31, "31", 9 * 60)],
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const sorted = sortFootORunners([runnerFinished, runnerInProgressFast, runnerInProgressSlow])
    const expected = [runnerInProgressFast, runnerFinished, runnerInProgressSlow] // Order by speed & position

    expect(sorted).toEqual(expected)
  })

  it("should put runners who have not started at the end sorted by start_time", () => {
    const runnerNotStarted1 = {
      ...baseRunner,
      id: "N1",
      full_name: "Not Started 1",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T10:05:00.000+00:00",
        online_splits: [], //TODO: empty split
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }
    const runnerNotStarted2 = {
      ...baseRunner,
      id: "N2",
      full_name: "Not Started 2",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T10:10:00.000+00:00",
        online_splits: [], //TODO: empty splits
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerStarted = {
      ...baseRunner,
      id: "S",
      full_name: "Started",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:55:00.000+00:00",
        online_splits: [makeSplit(31, "31", 300)],
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const sorted = sortFootORunners([runnerNotStarted2, runnerStarted, runnerNotStarted1])
    const expected = [runnerStarted, runnerNotStarted2, runnerNotStarted1]

    expect(sorted).toEqual(expected)
  })

  it("should respect status priority putting DSQ, DNF etc at the end", () => {
    const runnerOk = {
      ...baseRunner,
      id: "OK",
      full_name: "Ok Runner",
      stage: {
        ...baseRunner.stage,
        status_code: "0", // OK status code as string number
        online_splits: [makeSplit(31, "31", 300)],
        finish_time: null,
        position: 0,
        start_time: "2025-06-27T09:00:00.000+00:00",
      },
    }

    const runnerDSQ = {
      ...baseRunner,
      id: "DSQ",
      full_name: "Disqualified",
      stage: {
        ...baseRunner.stage,
        status_code: "6", // DSQ code as number string
        online_splits: [], //TODO: shall have online splits
        finish_time: null,
        position: 0,
        start_time: "2025-06-27T09:00:00.000+00:00",
      },
    }

    const runnerDNF = {
      ...baseRunner,
      id: "DNF",
      full_name: "Did Not Finish",
      stage: {
        ...baseRunner.stage,
        status_code: "5", // DNF code as number string
        online_splits: [], // TODO: shall have online_splits
        finish_time: null,
        position: 0,
        start_time: "2025-06-27T09:00:00.000+00:00",
      },
    }

    const sorted = sortFootORunners([runnerDSQ, runnerOk, runnerDNF])

    const expected = [runnerOk, runnerDNF, runnerDSQ]

    expect(sorted).toEqual(expected)
  })

  it("should correctly order mixed runners according to all rules", () => {
    const runnerNotStarted1 = {
      ...baseRunner,
      id: "N1",
      full_name: "Not Started 1",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T10:05:00.000+00:00",
        online_splits: [],
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerNotStarted2 = {
      ...baseRunner,
      id: "N2",
      full_name: "Not Started 2",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T10:10:00.000+00:00",
        online_splits: [],
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerDSQ = {
      ...baseRunner,
      id: "DSQ",
      full_name: "Disqualified",
      stage: {
        ...baseRunner.stage,
        status_code: "4",
        online_splits: [],
        finish_time: null,
        position: 0,
      },
    }

    const runnerDNF = {
      ...baseRunner,
      id: "DNF",
      full_name: "Did Not Finish",
      stage: {
        ...baseRunner.stage,
        status_code: "2",
        online_splits: [], // TODO: shall have online splits
        finish_time: null,
        position: 0,
      },
    }

    const runnerFinished = {
      ...baseRunner,
      id: "F",
      full_name: "Runner Finished",
      stage: {
        ...baseRunner.stage,
        online_splits: [
          makeSplit(31, "31", 8 * 60),
          makeSplit(32, "32", 10 * 60),
          makeSplit(33, "33", 12 * 60),
        ],
        finish_time: "2025-06-27T09:58:00.000+00:00",
        position: 1,
        status_code: "0",
      },
    }

    const runnerInProgressFast = {
      ...baseRunner,
      id: "I1",
      full_name: "Runner In Progress Fast",
      stage: {
        ...baseRunner.stage,
        online_splits: [makeSplit(31, "31", 4 * 60)], //TODO: Missing online control
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerInProgressSlow = {
      ...baseRunner,
      id: "S",
      full_name: "Runner In Progress Slow",
      stage: {
        ...baseRunner.stage,
        online_splits: [makeSplit(31, "31", 9 * 60)], // TODO: missing splits
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runners = [
      runnerNotStarted2,
      runnerDSQ,
      runnerInProgressSlow,
      runnerFinished,
      runnerDNF,
      runnerInProgressFast,
      runnerNotStarted1,
    ]
    const sorted = sortFootORunners(runners)

    const expectedOrder = [
      runnerInProgressFast, // Faster in progress first
      runnerFinished, // Finished next by position
      runnerInProgressSlow, // Slower in progress
      runnerNotStarted1, // Not started ordered by start_time (earlier)
      runnerNotStarted2, // Not started ordered by start_time (later)
      runnerDNF, // DNF near end
      runnerDSQ, // DSQ last
    ]

    expect(sorted).toEqual(expectedOrder)
  })
})
