import { describe, expect, it } from "vitest"
import { RunnerModel, UploadType } from "../../../../../shared/EntityTypes.ts"
import { RESULT_STATUS, RESULT_STATUS_TEXT } from "../../../shared/constants.ts"
import { UPLOAD_TYPES } from "./constants.ts"
import { canWinMedal, medalForPosition } from "./medals.ts"

function runnerWith(uploadType: UploadType, statusCode: string | null): RunnerModel {
  return {
    stage: { upload_type: uploadType, status_code: statusCode },
    overalls: null,
  } as unknown as RunnerModel
}

describe("canWinMedal", () => {
  it("accepts an OK runner with a splits reading", () => {
    expect(canWinMedal(runnerWith(UPLOAD_TYPES.SPLIT_RESULT, RESULT_STATUS.ok))).toBe(true)
    expect(canWinMedal(runnerWith(UPLOAD_TYPES.SPLIT_RESULT, RESULT_STATUS_TEXT.ok))).toBe(true)
  })

  it("rejects runners without a splits reading", () => {
    expect(canWinMedal(runnerWith(UPLOAD_TYPES.FINAL_RESULT, RESULT_STATUS.ok))).toBe(false)
    expect(canWinMedal(runnerWith(UPLOAD_TYPES.ONLINE_SPLITS, RESULT_STATUS.ok))).toBe(false)
    expect(canWinMedal(runnerWith(UPLOAD_TYPES.TOTAL_TIMES, RESULT_STATUS.ok))).toBe(false)
  })

  it("rejects runners whose status is not OK", () => {
    expect(canWinMedal(runnerWith(UPLOAD_TYPES.SPLIT_RESULT, RESULT_STATUS.mp))).toBe(false)
    expect(canWinMedal(runnerWith(UPLOAD_TYPES.SPLIT_RESULT, RESULT_STATUS.dsq))).toBe(false)
    expect(canWinMedal(runnerWith(UPLOAD_TYPES.SPLIT_RESULT, RESULT_STATUS.nc))).toBe(false)
    expect(canWinMedal(runnerWith(UPLOAD_TYPES.SPLIT_RESULT, null))).toBe(false)
  })
})

describe("medalForPosition", () => {
  it("gives gold, silver and bronze to the podium", () => {
    expect(medalForPosition(1, true)).toBe("gold")
    expect(medalForPosition(2, true)).toBe("silver")
    expect(medalForPosition(3, true)).toBe("bronze")
  })

  it("accepts bigint positions", () => {
    expect(medalForPosition(1n, true)).toBe("gold")
  })

  it("gives no medal outside the podium", () => {
    expect(medalForPosition(4, true)).toBeNull()
    expect(medalForPosition(0, true)).toBeNull()
    expect(medalForPosition(-1, true)).toBeNull()
  })

  it("gives no medal without a position", () => {
    expect(medalForPosition(null, true)).toBeNull()
  })

  it("gives no medal to an ineligible runner", () => {
    expect(medalForPosition(1, false)).toBeNull()
  })
})
