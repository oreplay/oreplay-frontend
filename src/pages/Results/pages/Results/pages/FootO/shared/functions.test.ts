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

  // Helper function to create a complete course structure with all controls
  function makeCompleteCourse(
    controls: {
      order: number
      station: string | null
      cumulative?: number | null
      split_time?: number | null
      is_next?: DateTime | null
    }[],
  ) {
    const allControls = [31, 32, 33, Infinity] // Standard course structure
    return allControls.map((controlNumber) => {
      const controlData = controls.find((c) => c.order === controlNumber)
      if (controlData) {
        return makeSplit(
          controlData.order,
          controlData.station,
          controlData.cumulative ?? null,
          controlData.split_time ?? null,
          controlData.is_next ?? null,
        )
      }
      // Empty split for controls not yet reached
      return makeSplit(
        controlNumber,
        controlNumber === Infinity ? "FINISH" : controlNumber.toString(),
        null,
        null,
        null,
      )
    })
  }

  function makeSplit(
    order_number: number,
    station: string | null,
    cumulative_time: number | null,
    split_time?: number | null,
    is_next?: DateTime | null,
  ) {
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
      time: split_time ?? null, // Fixed: now properly handles split time vs cumulative time
      status_code: "0",
      leg_number: 1,
      is_next: is_next ?? null, // Fixed: now properly handles is_next field
    }
  }

  it("should sort runners by last shared control cumulative_time", () => {
    const runnerA = {
      ...baseRunner,
      id: "A",
      full_name: "Runner A",
      stage: {
        ...baseRunner.stage,
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 8 * 60, split_time: 8 * 60 },
          {
            order: 32,
            station: "32",
            cumulative: 10 * 60,
            split_time: 2 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:58:00.000+00:00"),
          },
          { order: 33, station: "33", cumulative: 12 * 60, split_time: 2 * 60 },
        ]),
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
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 4 * 60,
            split_time: 4 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:54:00.000+00:00"),
          },
        ]),
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
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 8 * 60, split_time: 8 * 60 },
          { order: 32, station: "32", cumulative: 10 * 60, split_time: 2 * 60 },
          {
            order: 33,
            station: "33",
            cumulative: 12 * 60,
            split_time: 2 * 60,
            is_next: DateTime.fromISO("2025-06-27T10:02:00.000+00:00"),
          },
        ]),
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerB = {
      // Fixed: Both runners now have the same number of splits but some are empty
      ...baseRunner,
      id: "B",
      full_name: "Runner B",
      stage: {
        ...baseRunner.stage,
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 4 * 60, split_time: 4 * 60 },
          {
            order: 32,
            station: "32",
            cumulative: 9 * 60,
            split_time: 5 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:59:00.000+00:00"),
          },
        ]),
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
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 8 * 60, split_time: 8 * 60 },
          { order: 32, station: "32", cumulative: 10 * 60, split_time: 2 * 60 },
          { order: 33, station: "33", cumulative: 12 * 60, split_time: 2 * 60 },
          { order: Infinity, station: "FINISH", cumulative: 12 * 60, split_time: 0 },
        ]),
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
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 4 * 60,
            split_time: 4 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:54:00.000+00:00"),
          },
        ]),
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
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 9 * 60,
            split_time: 9 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:59:00.000+00:00"),
          },
        ]),
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
        online_splits: makeCompleteCourse([]), // Empty course for not started runners
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
        online_splits: makeCompleteCourse([]), // Empty course for not started runners
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
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 300,
            split_time: 300,
            is_next: DateTime.fromISO("2025-06-27T09:55:00.000+00:00"),
          },
        ]),
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const sorted = sortFootORunners([runnerNotStarted2, runnerStarted, runnerNotStarted1])
    const expected = [runnerStarted, runnerNotStarted1, runnerNotStarted2]

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
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 300,
            split_time: 300,
            is_next: DateTime.fromISO("2025-06-27T09:05:00.000+00:00"),
          },
        ]),
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
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 250, split_time: 250 },
          { order: 32, station: "32", cumulative: 400, split_time: 150 },
        ]), // DSQ runners have online splits showing their progress before disqualification
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
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 280, split_time: 280 },
        ]), // DNF runners have partial online splits
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
        online_splits: makeCompleteCourse([]), // Empty course for not started runners
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
        online_splits: makeCompleteCourse([]), // Empty course for not started runners
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
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 3 * 60, split_time: 3 * 60 },
          { order: 32, station: "32", cumulative: 6 * 60, split_time: 3 * 60 },
        ]), // DSQ runner had some progress before disqualification
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
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 7 * 60, split_time: 7 * 60 },
        ]), // DNF runner has partial online splits
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
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 8 * 60, split_time: 8 * 60 },
          { order: 32, station: "32", cumulative: 10 * 60, split_time: 2 * 60 },
          { order: 33, station: "33", cumulative: 12 * 60, split_time: 2 * 60 },
          { order: Infinity, station: "FINISH", cumulative: 12 * 60, split_time: 0 },
        ]),
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
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 4 * 60,
            split_time: 4 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:54:00.000+00:00"),
          },
        ]), // Fixed: Added missing online control structure
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
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 9 * 60,
            split_time: 9 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:59:00.000+00:00"),
          },
        ]), // Fixed: Added missing splits
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

  it("should sort runners who have finished", () => {
    const runnerPos2 = {
      ...baseRunner,
      id: "P2",
      full_name: "Pos2",
      stage: {
        ...baseRunner.stage,
        finish_time: "2024-10-18T15:18:07.000+00:00",
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 226, split_time: 226 },
          { order: 32, station: "32", cumulative: 513, split_time: 287 },
          { order: Infinity, station: "FINISH", cumulative: 907, split_time: 394 },
        ]),
        position: 2,
        status_code: "0",
      },
    }

    const runnerPos1 = {
      ...baseRunner,
      id: "P1",
      full_name: "Pos1",
      stage: {
        ...baseRunner.stage,
        finish_time: "2024-10-18T15:22:04.000+00:00",
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 217, split_time: 217 },
          { order: 32, station: "32", cumulative: 440, split_time: 223 },
          { order: Infinity, station: "FINISH", cumulative: 845, split_time: 405 },
        ]),
        position: 1,
        status_code: "0",
      },
    }

    const runnerRunningWinning = {
      ...baseRunner,
      id: "RW",
      full_name: "Running Winner",
      stage: {
        ...baseRunner.stage,
        finish_time: null,
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 201, split_time: 201 },
          {
            order: 32,
            station: "32",
            cumulative: 413,
            split_time: 212,
            is_next: DateTime.fromISO("2025-06-27T09:56:53.000+00:00"),
          },
        ]),
        position: 0,
        status_code: "0",
      },
    }

    const runnerList = [runnerPos2, runnerRunningWinning, runnerPos1]

    const expectedRunnerList = [runnerRunningWinning, runnerPos1, runnerPos2]

    expect(sortFootORunners(runnerList)).toEqual(expectedRunnerList)
  })

  it("should handle projection logic: runner with fewer splits but slower projected time", () => {
    // Scenario: Runner A has 1 split (15 seconds), Runner B has 2 splits (total 20 seconds)
    // But Runner A's projected current time is over 20 seconds, so should go below Runner B
    const runnerA = {
      ...baseRunner,
      id: "A",
      full_name: "Runner A - Few Splits, Slow",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:50:00.000+00:00", // Started 10 minutes ago
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 15,
            split_time: 15,
            is_next: DateTime.fromISO("2025-06-27T09:50:15.000+00:00"),
          },
        ]), // Only 1 split at 15 seconds
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerB = {
      ...baseRunner,
      id: "B",
      full_name: "Runner B - More Splits, Faster",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:52:00.000+00:00", // Started 8 minutes ago
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 12, split_time: 12 }, // Faster at control 31
          {
            order: 32,
            station: "32",
            cumulative: 20,
            split_time: 8,
            is_next: DateTime.fromISO("2025-06-27T09:52:20.000+00:00"),
          }, // Total 20 seconds at control 32
        ]),
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const sorted = sortFootORunners([runnerA, runnerB])
    // Runner B should be ahead because even though they have more splits,
    // their last split time (20s) is better than Runner A's projected time
    const expected = [runnerB, runnerA]

    expect(sorted).toEqual(expected)
  })

  it("should handle mixed finished and in-progress runners with projection", () => {
    const runnerFinishedSlow = {
      ...baseRunner,
      id: "FS",
      full_name: "Finished Slow",
      stage: {
        ...baseRunner.stage,
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 10 * 60, split_time: 10 * 60 }, // 10 minutes at control 31
          { order: 32, station: "32", cumulative: 15 * 60, split_time: 5 * 60 }, // 15 minutes at control 32
          { order: 33, station: "33", cumulative: 23 * 60, split_time: 8 * 60 }, // 23 minutes at control 33
          { order: Infinity, station: "FINISH", cumulative: 25 * 60, split_time: 2 * 60 }, // Finished at 25 minutes
        ]),
        finish_time: "2025-06-27T10:15:00.000+00:00",
        time_seconds: 25 * 60,
        position: 2,
        status_code: "0",
      },
    }

    const runnerInProgressFast = {
      ...baseRunner,
      id: "IF",
      full_name: "In Progress Fast",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:52:00.000+00:00", // Started 8 minutes ago
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 4 * 60,
            split_time: 4 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:56:00.000+00:00"),
          },
        ]), // Very fast - 4 minutes at control 31
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const sorted = sortFootORunners([runnerFinishedSlow, runnerInProgressFast])
    // Fast in-progress runner should be ahead of slow finished runner
    const expected = [runnerInProgressFast, runnerFinishedSlow]

    expect(sorted).toEqual(expected)
  })

  it("should handle runners with incomplete data gracefully", () => {
    const runnerWithMissedControl = {
      ...baseRunner,
      id: "MC",
      full_name: "Missed Control",
      stage: {
        ...baseRunner.stage,
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 5 * 60, split_time: 5 * 60 }, // Got control 31
          // Missing control 32 data - empty entry will be created by makeCompleteCourse
          { order: 33, station: "33", cumulative: null, split_time: null }, // Missed punch at control 33
        ]),
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerNormal = {
      ...baseRunner,
      id: "N",
      full_name: "Normal Runner",
      stage: {
        ...baseRunner.stage,
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 6 * 60,
            split_time: 6 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:56:00.000+00:00"),
          },
        ]), // Slightly slower but complete
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const sorted = sortFootORunners([runnerWithMissedControl, runnerNormal])
    // Runner with missed control should still be sorted based on available data
    // Since runnerWithMissedControl was faster at control 31, they should be ahead
    const expected = [runnerWithMissedControl, runnerNormal]

    expect(sorted).toEqual(expected)
  })

  it("should properly sort DNS/DNF/DSQ runners at the bottom", () => {
    const runnerOK = {
      ...baseRunner,
      id: "OK",
      full_name: "OK Runner",
      stage: {
        ...baseRunner.stage,
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 300,
            split_time: 300,
            is_next: DateTime.fromISO("2025-06-27T09:55:00.000+00:00"),
          },
        ]),
        finish_time: null,
        position: 0,
        status_code: "0", // OK
      },
    }

    const runnerDNS = {
      ...baseRunner,
      id: "DNS",
      full_name: "Did Not Start",
      stage: {
        ...baseRunner.stage,
        online_splits: makeCompleteCourse([]), // Empty course for DNS
        finish_time: null,
        position: 0,
        status_code: "1", // DNS
      },
    }

    const runnerDSQ = {
      ...baseRunner,
      id: "DSQ",
      full_name: "Disqualified",
      stage: {
        ...baseRunner.stage,
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 200, split_time: 200 },
        ]), // Was fastest but got disqualified
        finish_time: null,
        position: 0,
        status_code: "4", // DSQ
      },
    }

    const runnerDNF = {
      ...baseRunner,
      id: "DNF",
      full_name: "Did Not Finish",
      stage: {
        ...baseRunner.stage,
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 250, split_time: 250 },
        ]),
        finish_time: null,
        position: 0,
        status_code: "2", // DNF
      },
    }

    const sorted = sortFootORunners([runnerDSQ, runnerDNS, runnerOK, runnerDNF])
    // OK runner first, then DNF, then DSQ, then DNS (based on status priority)
    const expected = [runnerOK, runnerDNF, runnerDSQ, runnerDNS]

    expect(sorted).toEqual(expected)
  })

  it("should handle complex scenario with multiple runner types", () => {
    const runnerFinished1st = {
      ...baseRunner,
      id: "F1",
      full_name: "Finished 1st",
      stage: {
        ...baseRunner.stage,
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 4 * 60, split_time: 4 * 60 },
          { order: 32, station: "32", cumulative: 8 * 60, split_time: 4 * 60 },
          { order: 33, station: "33", cumulative: 11 * 60, split_time: 3 * 60 },
          { order: Infinity, station: "FINISH", cumulative: 12 * 60, split_time: 60 },
        ]),
        finish_time: "2025-06-27T10:02:00.000+00:00",
        time_seconds: 12 * 60,
        position: 1,
        status_code: "0",
      },
    }

    const runnerInProgressFast = {
      ...baseRunner,
      id: "IF",
      full_name: "In Progress Fast",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:56:00.000+00:00", // Started 4 minutes ago, current time = 4 minutes
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 3 * 60,
            split_time: 3 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:59:00.000+00:00"),
          },
        ]), // Very fast at control 31
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerInProgressSlow = {
      ...baseRunner,
      id: "IS",
      full_name: "In Progress Slow",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:50:00.000+00:00", // Started 10 minutes ago
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 8 * 60,
            split_time: 8 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:58:00.000+00:00"),
          },
        ]), // Slow at control 31
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerNotStarted = {
      ...baseRunner,
      id: "NS",
      full_name: "Not Started",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T10:05:00.000+00:00", // Starts in 5 minutes
        online_splits: makeCompleteCourse([]), // Empty course for not started
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
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 2 * 60, split_time: 2 * 60 },
        ]), // Was fastest but disqualified
        finish_time: null,
        position: 0,
        status_code: "4", // DSQ
      },
    }

    const sorted = sortFootORunners([
      runnerDSQ,
      runnerNotStarted,
      runnerInProgressSlow,
      runnerFinished1st,
      runnerInProgressFast,
    ])

    // Expected order:
    // 1. Fast in-progress runner (projected to beat finished runner)
    // 2. Finished 1st place runner
    // 3. Slow in-progress runner
    // 4. Not started runner
    // 5. Disqualified runner (at bottom due to status)
    const expected = [
      runnerInProgressFast,
      runnerFinished1st,
      runnerInProgressSlow,
      runnerNotStarted,
      runnerDSQ,
    ]

    expect(sorted).toEqual(expected)
  })

  it("should prioritize runners approaching next control (is_next field logic)", () => {
    const runnerApproachingNext = {
      ...baseRunner,
      id: "AN",
      full_name: "Approaching Next Control",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:50:00.000+00:00",
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 5 * 60, split_time: 5 * 60 },
          {
            order: 32,
            station: "32",
            cumulative: null,
            split_time: null,
            is_next: DateTime.fromISO("2025-06-27T09:55:00.000+00:00"),
          },
        ]),
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerSameProgressNoNext = {
      ...baseRunner,
      id: "SP",
      full_name: "Same Progress No Next",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:50:00.000+00:00",
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 5 * 60, split_time: 5 * 60 },
        ]),
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const sorted = sortFootORunners([runnerSameProgressNoNext, runnerApproachingNext])
    // Runner approaching next control should be prioritized
    const expected = [runnerApproachingNext, runnerSameProgressNoNext]

    expect(sorted).toEqual(expected)
  })

  it("should handle runners with different is_next timing", () => {
    const runnerRecentNext = {
      ...baseRunner,
      id: "RN",
      full_name: "Recent Next Control",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:50:00.000+00:00",
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 5 * 60, split_time: 5 * 60 },
          {
            order: 32,
            station: "32",
            cumulative: null,
            split_time: null,
            is_next: DateTime.fromISO("2025-06-27T09:58:00.000+00:00"),
          },
        ]),
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerOlderNext = {
      ...baseRunner,
      id: "ON",
      full_name: "Older Next Control",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:50:00.000+00:00",
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: 5 * 60, split_time: 5 * 60 },
          {
            order: 32,
            station: "32",
            cumulative: null,
            split_time: null,
            is_next: DateTime.fromISO("2025-06-27T09:55:00.000+00:00"),
          },
        ]),
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const sorted = sortFootORunners([runnerOlderNext, runnerRecentNext])
    // Runner with more recent is_next time should be prioritized (closer to reaching control)
    const expected = [runnerRecentNext, runnerOlderNext]

    expect(sorted).toEqual(expected)
  })

  it("should handle comprehensive edge cases with empty and null values", () => {
    const runnerWithNulls = {
      ...baseRunner,
      id: "WN",
      full_name: "With Nulls",
      stage: {
        ...baseRunner.stage,
        start_time: null, // No start time
        online_splits: makeCompleteCourse([]), // Empty splits
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerPartialData = {
      ...baseRunner,
      id: "PD",
      full_name: "Partial Data",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:50:00.000+00:00",
        online_splits: makeCompleteCourse([
          { order: 31, station: "31", cumulative: null, split_time: null }, // Missed control
          { order: 32, station: "32", cumulative: 8 * 60, split_time: 8 * 60 }, // Got this one somehow
        ]),
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const runnerNormal = {
      ...baseRunner,
      id: "N",
      full_name: "Normal",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:55:00.000+00:00",
        online_splits: makeCompleteCourse([
          {
            order: 31,
            station: "31",
            cumulative: 4 * 60,
            split_time: 4 * 60,
            is_next: DateTime.fromISO("2025-06-27T09:59:00.000+00:00"),
          },
        ]),
        finish_time: null,
        position: 0,
        status_code: "0",
      },
    }

    const sorted = sortFootORunners([runnerWithNulls, runnerPartialData, runnerNormal])
    // Normal runner first, then partial data, then runner with nulls at end
    const expected = [runnerNormal, runnerPartialData, runnerWithNulls]

    expect(sorted).toEqual(expected)
  })
})
