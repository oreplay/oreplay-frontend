import { describe, it, expect, vi, afterEach } from "vitest"
import { RunnerModel } from "../../shared/EntityTypes.ts"
import { RESULT_STATUS } from "../../pages/Results/shared/constants.ts"
import { runnerService } from "./RunnerService.ts"
import { UPLOAD_TYPES } from "../../pages/Results/pages/Results/shared/constants.ts"
import { DateTime } from "luxon"

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
    upload_type: UPLOAD_TYPES.SPLIT_RESULT,
    time_seconds: 420,
    position: 2,
    status_code: RESULT_STATUS.ok,
    time_behind: 0,
    time_neutralization: 0,
    time_adjusted: 0,
    time_penalty: 0,
    time_bonus: 0,
    points_final: 0,
    points_behind: 0,
    points_adjusted: 0,
    points_penalty: 0,
    points_bonus: 0,
    leg_number: 1,
    splits: [],
  },
  overalls: null,
}

describe("RunnerService.hasFinished", () => {
  it("Should return true if runner finished due to finish time", () => {
    expect(runnerService.hasFinished(baseRunner)).toBeTruthy()
  })

  it("Should return true if runner finished due to dns", () => {
    const runner: RunnerModel = {
      ...baseRunner,
      stage: {
        ...baseRunner.stage,
        position: 0,
        finish_time: null,
        status_code: RESULT_STATUS.dns,
      },
    }
    expect(runnerService.hasFinished(runner)).toBeTruthy()
  })

  it("Should return true if runner finished due to non-ok status", () => {
    const runner: RunnerModel = {
      ...baseRunner,
      stage: {
        ...baseRunner.stage,
        finish_time: null,
        time_seconds: 0,
        position: 0,
        status_code: RESULT_STATUS.dsq,
      },
    }
    expect(runnerService.hasFinished(runner)).toBeTruthy()
  })

  it("Should return false if runner is running or did not started", () => {
    // Case upload type start time
    const runner: RunnerModel = {
      ...baseRunner,
      stage: {
        ...baseRunner.stage,
        finish_time: null,
        position: 0,
        time_behind: 0,
        time_seconds: 0,
        upload_type: UPLOAD_TYPES.START_TIMES,
        status_code: RESULT_STATUS.ok,
      },
    }
    expect(runnerService.hasFinished(runner), "upload_type start-time").toBeFalsy()

    // Case upload type online splits
    runner.stage.upload_type = UPLOAD_TYPES.ONLINE_SPLITS
    expect(runnerService.hasFinished(runner), "upload_type online-splits").toBeFalsy()

    // Case upload type online splits
    runner.stage.upload_type = UPLOAD_TYPES.SPLIT_RESULT
    expect(runnerService.hasFinished(runner), "upload_type splits").toBeFalsy()

    // Case upload type finish
    runner.stage.upload_type = UPLOAD_TYPES.SPLIT_RESULT
    expect(runnerService.hasFinished(runner), "upload_type finish").toBeFalsy()
  })
})

describe("RunnerService.hasStarted", () => {
  afterEach(() => vi.useRealTimers())

  const runner: RunnerModel = {
    ...baseRunner,
    stage: {
      ...baseRunner.stage,
      finish_time: null,
      upload_type: UPLOAD_TYPES.START_TIMES,
      time_seconds: 0,
      time_behind: 0,
      position: 0,
    },
  }

  it("Should return true if runner has started", () => {
    // Provide time
    const now = DateTime.fromISO("2025-06-27T09:10:00.000+00:00") as DateTime<true>
    expect(runnerService.hasStarted(runner, now), "Providing time").toBeTruthy()

    // Use system time
    vi.setSystemTime(new Date("2025-06-27T09:10:00.000+00:00"))
    expect(runnerService.hasStarted(runner, now), "Usings system time").toBeTruthy()
  })

  it("Should return false if runner has not started", () => {
    // Provide time
    const now = DateTime.fromISO("2025-06-27T08:50:00.000+00:00") as DateTime<true>
    expect(runnerService.hasStarted(runner, now), "Providing time").toBeFalsy()

    // Use system time
    vi.setSystemTime(new Date("2025-06-27T08:50:00.000+00:00"))
    expect(runnerService.hasStarted(runner, now), "Usings system time").toBeFalsy()
  })

  it("Should return false if runner doesn't have start time", () => {
    const thisRunner: RunnerModel = {
      ...runner,
      stage: {
        ...runner.stage,
        start_time: null,
      },
    }

    // Provide time
    const now = DateTime.fromISO("2025-06-27T09:10:00.000+00:00") as DateTime<true>
    expect(runnerService.hasStarted(thisRunner, now), "Providing time").toBeFalsy()

    // Use system time
    vi.setSystemTime(new Date("2025-06-27T09:10:00.000+00:00"))
    expect(runnerService.hasStarted(thisRunner, now), "Using system time").toBeFalsy()
  })

  it("Should return true if runner has finished", () => {
    const thisRunner: RunnerModel = {
      ...baseRunner,
      stage: {
        ...baseRunner.stage,
        start_time: null,
        finish_time: "2025-06-27T09:07:00.000+00:00",
        position: 1,
        time_seconds: 7 * 60,
        upload_type: UPLOAD_TYPES.SPLIT_RESULT,
      },
    }

    // Provide time
    const now = DateTime.fromISO("2025-06-27T09:10:00.000+00:00") as DateTime<true>
    expect(runnerService.hasStarted(thisRunner, now), "Providing time").toBeTruthy()

    // Use system time
    vi.setSystemTime(new Date("2025-06-27T09:10:00.000+00:00"))
    expect(runnerService.hasStarted(thisRunner, now), "Usings system time").toBeTruthy()
  })
})
