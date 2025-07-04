import { describe, it, expect } from "vitest"
import { RunnerModel } from "../../../../../../../shared/EntityTypes.ts"
import { orderedRunners } from "../../../../../shared/functions.ts"

describe("orderRunners and orderFootORunners", () => {
  it("should handle different classification statuses", () => {
    const baseRunner: RunnerModel = {
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
      },
      overalls: null,
    }

    const runnerStatusOK = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: "0" },
    }

    const runnerStatusDNS = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: "1" },
    }

    const runnerStatusDNF = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: "2" },
    }

    const runnerStatusMP = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: "3" },
    }

    const runnerStatusDSQ = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: "4" },
    }

    const runnerStatusOT = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: "5" },
    }

    const runnerStatusNC = {
      ...baseRunner,
      full_name: "string",
      stage: { ...baseRunner.stage, status_code: "9" },
    }

    const runnerList: RunnerModel[] = [
      runnerStatusDNS,
      runnerStatusOK,
      runnerStatusNC,
      runnerStatusDNF,
      runnerStatusMP,
      runnerStatusOT,
      runnerStatusDSQ,
    ]

    const expected: RunnerModel[] = [
      runnerStatusOK,
      runnerStatusNC,
      runnerStatusOT,
      runnerStatusMP,
      runnerStatusDNF,
      runnerStatusDSQ,
      runnerStatusDNS,
    ]
    const actual: RunnerModel[] = orderedRunners(runnerList)

    expect(actual).toEqual(expected)
  })

  it("should handle nc", () => {
    const baseRunner: RunnerModel = {
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
      },
      overalls: null,
    }

    const runnerOK: RunnerModel = {
      ...baseRunner,
      full_name: "string1",
      is_nc: false,
      stage: {
        ...baseRunner.stage,
        time_seconds: 400,
      },
    }

    const runnerNC: RunnerModel = {
      ...baseRunner,
      full_name: "stringnc",
      is_nc: true,
      stage: {
        ...baseRunner.stage,
        time_seconds: 400,
      },
    }

    const runnerAlsoOK: RunnerModel = {
      ...baseRunner,
      full_name: "string2",
      is_nc: false,
      stage: {
        ...baseRunner.stage,
        time_seconds: 420,
      },
    }
    const runnerList: RunnerModel[] = [runnerNC, runnerOK, runnerAlsoOK]

    const expected: RunnerModel[] = [
      runnerOK,
      runnerAlsoOK,
      runnerNC, // ¿NC debe ir al final aunque el status sea "2"?
    ]

    const actual: RunnerModel[] = orderedRunners(runnerList)

    expect(actual).toEqual(expected)
  })

  it("should handle in-race runners mixed with finished runners", () => {
    const baseRunner: RunnerModel = {
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
      },
      overalls: null,
    }

    const runnerFinished1: RunnerModel = {
      ...baseRunner,
      full_name: "Runner Finished 1",
      stage: {
        ...baseRunner.stage,
        finish_time: "2025-06-27T09:07:00.000+00:00",
        position: 1,
      },
    }

    const runnerStillRunning: RunnerModel = {
      ...baseRunner,
      full_name: "Runner Still Running",
      stage: {
        ...baseRunner.stage,
        finish_time: null,
        position: 0,
      },
    }

    const runnerFinished2: RunnerModel = {
      ...baseRunner,
      full_name: "Runner Finished 2",
      stage: {
        ...baseRunner.stage,
        finish_time: "2025-06-27T09:08:00.000+00:00",
        position: 2,
      },
    }
    const runnerFinished3: RunnerModel = {
      ...baseRunner,
      full_name: "Runner Finished 3",
      stage: {
        ...baseRunner.stage,
        finish_time: "2025-06-27T09:09:00.000+00:00",
        position: 3,
      },
    }

    const runnerFinished4: RunnerModel = {
      ...baseRunner,
      full_name: "Runner Finished 4",
      stage: {
        ...baseRunner.stage,
        finish_time: "2025-06-27T09:10:00.000+00:00",
        position: 4,
      },
    }

    const runnerStillRunning2: RunnerModel = {
      ...baseRunner,
      full_name: "Runner Still Running 2",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T10:00:00.000+00:00",
        finish_time: null,
        position: 0,
      },
    }

    const runnerList: RunnerModel[] = [
      runnerStillRunning,
      runnerFinished1,
      runnerFinished2,
      runnerStillRunning2,
      runnerFinished4,
      runnerFinished3,
    ]

    const expected: RunnerModel[] = [
      runnerFinished1,
      runnerFinished2,
      runnerFinished3,
      runnerFinished4,
      runnerStillRunning2,
      runnerStillRunning,
    ]

    const actual: RunnerModel[] = orderedRunners(runnerList)

    expect(actual).toEqual(expected)
  })

  it("should handle runners without start time (they should be at the end)", () => {
    const baseRunner: RunnerModel = {
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
      },
      overalls: null,
    }

    const runnerWithStartTime: RunnerModel = {
      ...baseRunner,
      full_name: "Runner With Start",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:00:00.000+00:00",
      },
    }

    const runnerWithoutStartTime: RunnerModel = {
      ...baseRunner,
      full_name: "Runner No Start",
      stage: {
        ...baseRunner.stage,
        start_time: null,
      },
    }

    const runnerWithStartTime2: RunnerModel = {
      ...baseRunner,
      full_name: "Runner With Start 2",
      stage: {
        ...baseRunner.stage,
        start_time: "2025-06-27T09:05:00.000+00:00",
      },
    }

    const runnerList: RunnerModel[] = [
      runnerWithStartTime2,
      runnerWithoutStartTime,
      runnerWithStartTime,
    ]

    const expected: RunnerModel[] = [
      runnerWithStartTime,
      runnerWithStartTime2,
      runnerWithoutStartTime,
    ]

    const actual: RunnerModel[] = orderedRunners(runnerList)

    expect(actual).toEqual(expected)
  })
})

describe("orderFootORunners", () => {
  //TODO: Fill this test suite

  it("should handle online controls", () => {
    // pendiente de implementación
  })
})
