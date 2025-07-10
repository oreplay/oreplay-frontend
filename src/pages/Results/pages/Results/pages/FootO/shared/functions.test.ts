import { describe, it, expect, vi} from "vitest"
import { sortRunners } from "../../../../../shared/sortingFunctions/sortRunners.ts"
import { RESULT_STATUS } from "../../../../../shared/constants.ts"
import { sortFootORunners } from "./functions.ts"
import { DateTime } from "luxon"

describe("orderRunners and orderFootORunners", () => {
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

describe("orderFootRunners", () => {
  vi.spyOn(DateTime, "now").mockReturnValue(
    DateTime.fromISO("2025-06-27T10:00:00.000+00:00") as DateTime<true>
  )

  const baseRunner = {
    id: "",
    bib_number: "1000",
    is_nc: false,
    eligibility: null,
    sicard: "11111111",
    sex: "M",
    class: { id: "1", short_name: "M21", long_name: "Men 21 Elite" },
    club: { id: "1", short_name: "ClubA" },
    full_name: "",
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

  const defaultIsNext = DateTime.fromISO("1970-01-01T00:00:00.000+00:00")

  const runnerFinished = {
    ...baseRunner,
    id: "1",
    full_name: "Runner Finished",
    stage: {
      ...baseRunner.stage,
      start_time: "2025-06-27T09:40:00.000+00:00", // started earlier
      finish_time: "2025-06-27T10:03:00.000+00:00",
      time_seconds: 780,
      position: 1,
      online_splits: [
        {
          id: "split1",
          is_intermediate: true,
          reading_time: "2025-06-27T09:50:00.000+00:00",
          points: 0,
          time_behind: 0,
          position: 0,
          cumulative_position: 0,
          cumulative_behind: 0,
          cumulative_time: 600,
          order_number: 1,
          control: {
            id: "c1",
            station: "31",
            control_type: { id: "ctrl-type-1", description: "Normal Control" },
          },
          time: 600,
          status_code: "0",
          leg_number: 1,
          is_next: defaultIsNext,
        },
        {
          id: "split2",
          is_intermediate: true,
          reading_time: "2025-06-27T10:00:00.000+00:00",
          points: 0,
          time_behind: 0,
          position: 0,
          cumulative_position: 0,
          cumulative_behind: 0,
          cumulative_time: 780,
          order_number: 2,
          control: {
            id: "c2",
            station: "32",
            control_type: { id: "ctrl-type-1", description: "Normal Control" },
          },
          time: 780,
          status_code: "0",
          leg_number: 1,
          is_next: defaultIsNext,
        },
      ],
    },
  }

  const runnerPassedOneControl = {
    ...baseRunner,
    id: "2",
    full_name: "Runner Passed 1 Control",
    stage: {
      ...baseRunner.stage,
      start_time: "2025-06-27T09:50:50.000+00:00",
      finish_time: null,
      time_seconds: 0,
      position: 0,
      online_splits: [
        {
          id: "split1",
          is_intermediate: true,
          reading_time: "2025-06-27T09:54:10.000+00:00", // cambiado aquí para 250 segundos
          points: 0,
          time_behind: 0,
          position: 0,
          cumulative_position: 0,
          cumulative_behind: 0,
          cumulative_time: 250, // cambiar también a 250 para coherencia
          order_number: 1,
          control: {
            id: "c1",
            station: "31",
            control_type: { id: "ctrl-type-1", description: "Normal Control" },
          },
          time: 250,
          status_code: "0",
          leg_number: 1,
          is_next: defaultIsNext,
        },
      ],
    },
  }

  const runnerPassedTwoControlsNoFinish = {
    ...baseRunner,
    id: "3",
    full_name: "Runner Passed 2 Controls No Finish",
    stage: {
      ...baseRunner.stage,
      start_time: "2025-06-27T09:45:00.000+00:00",
      finish_time: null,
      time_seconds: 0,
      position: 0,
      online_splits: [
        {
          id: "split1",
          is_intermediate: true,
          reading_time: "2025-06-27T09:50:00.000+00:00",
          points: 0,
          time_behind: 0,
          position: 0,
          cumulative_position: 0,
          cumulative_behind: 0,
          cumulative_time: 300,
          order_number: 1,
          control: {
            id: "c1",
            station: "31",
            control_type: { id: "ctrl-type-1", description: "Normal Control" },
          },
          time: 300,
          status_code: "0",
          leg_number: 1,
          is_next: defaultIsNext,
        },
        {
          id: "split2",
          is_intermediate: true,
          reading_time: "2025-06-27T09:58:00.000+00:00",
          points: 0,
          time_behind: 0,
          position: 0,
          cumulative_position: 0,
          cumulative_behind: 0,
          cumulative_time: 480,
          order_number: 2,
          control: {
            id: "c2",
            station: "32",
            control_type: { id: "ctrl-type-1", description: "Normal Control" },
          },
          time: 480,
          status_code: "0",
          leg_number: 1,
          is_next: defaultIsNext,
        },
      ],
    },
  }

  const runnerNotStartedYet = {
    ...baseRunner,
    id: "4",
    full_name: "Runner Not Started Yet",
    stage: {
      ...baseRunner.stage,
      start_time: "2025-06-27T10:05:00.000+00:00", // starts in future
      finish_time: null,
      time_seconds: 0,
      position: 0,
      online_splits: [],
    },
  }

  const runnerStartedNoControls = {
    ...baseRunner,
    id: "5",
    full_name: "Runner Started No Controls",
    stage: {
      ...baseRunner.stage,
      start_time: "2025-06-27T09:45:00.000+00:00",
      finish_time: null,
      time_seconds: 0,
      position: 0,
      online_splits: [],
    },
  }

  it("should order runners correctly in complex scenario with different start times", () => {
    const input = [
      runnerNotStartedYet,
      runnerPassedTwoControlsNoFinish,
      runnerPassedOneControl,
      runnerStartedNoControls,
      runnerFinished,
    ]
    const result = sortFootORunners(input)

    // Expected order explained:
    // 1. Runner Passed Two Controls No Finish (started 09:45, 2 splits, cumulative_time 480)
    // 2. Runner Passed One Control (started 09:50, 1 split, cumulative_time 300)
    // 3. Runner Started No Controls (started 09:55, no splits)
    // 4. Runner Finished (started 09:40, finished at 10:03, position 1)
    // 5. Runner Not Started Yet (starts 10:05)

    const expectedOrder = [
      runnerPassedTwoControlsNoFinish,
      runnerPassedOneControl,
      runnerFinished,
      runnerStartedNoControls,
      runnerNotStartedYet,
    ]

    expect(result).toEqual(expectedOrder)
  })
  it("orders in-progress runners provisionally above finished ones if their current time is lower", () => {
    const runners = [
      runnerPassedTwoControlsNoFinish, // id: "3"
      runnerFinished,                  // id: "2"
      runnerNotStartedYet,             // id: "5"
      runnerPassedOneControl,          // id: "1"
      runnerStartedNoControls,         // id: "4"
    ]

    const result = sortFootORunners(runners)

    const expectedOrder = [
      runnerPassedTwoControlsNoFinish, // in-progress with 2 controls, ahead of finisher
      runnerPassedOneControl,          // in-progress with 1 control
      runnerFinished,                  // finished but provisional position is lower
      runnerStartedNoControls,         // started but no controls
      runnerNotStartedYet,             // no start
    ]

    expect(result).toEqual(expectedOrder)
  })
})
