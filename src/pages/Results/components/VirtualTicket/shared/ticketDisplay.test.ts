import { describe, expect, it } from "vitest"
import { RESULT_STATUS, RESULT_STATUS_TEXT } from "../../../shared/constants.ts"
import {
  ProcessedRunnerModel,
  ProcessedRunnerResultModel,
  ProcessedSplitModel,
  ProcessedTeamRunnerModel,
} from "./EntityTypes.ts"
import {
  EMPTY_VALUE,
  STATUS_CHIP_VARIANT,
  behindText,
  classSize,
  isBestPosition,
  isFinishOrder,
  isMissedSplit,
  isRankedResult,
  isTimeInvalidated,
  resultStatus,
  splitStandingText,
  statusChipVariant,
  statusLabelKey,
  teamMemberNames,
  timeOfDayText,
  unrankedTimeText,
} from "./ticketDisplay.ts"

const RESULT: ProcessedRunnerResultModel = {
  id: "result",
  result_type_id: "type",
  start_time: "2025-10-26T09:00:00.000+00:00",
  finish_time: "2025-10-26T09:40:46.000+00:00",
  upload_type: "res_splits",
  time_seconds: 2446,
  position: 3,
  status_code: RESULT_STATUS.ok,
  time_behind: 108,
  time_neutralization: 0,
  time_adjusted: 0,
  time_penalty: 0,
  time_bonus: 0,
  points_final: 942,
  points_behind: 0,
  points_adjusted: 0,
  points_penalty: 0,
  points_bonus: 0,
  splits: [],
  online_splits: null,
}

const SPLIT: ProcessedSplitModel = {
  id: "split",
  is_intermediate: false,
  reading_time: "2025-10-26T09:03:12.000+00:00",
  order_number: 1,
  points: null,
  control: null,
  time: 192,
  time_behind: 8,
  position: 4,
  cumulative_time: 192,
  cumulative_behind: 8,
  cumulative_position: 4,
}

describe("behindText", () => {
  it("writes how far a ranked result is behind the winner", () => {
    expect(behindText(RESULT)).toBe("+01:48")
  })

  it("is a dash for a result that is not ranked", () => {
    expect(behindText({ ...RESULT, status_code: RESULT_STATUS.mp })).toBe(EMPTY_VALUE)
  })
})

describe("classSize", () => {
  const runnerWith = (result: Partial<ProcessedRunnerResultModel>) =>
    ({ stage: { ...RESULT, ...result } }) as ProcessedRunnerModel

  it("counts only the runners that finished with an OK status", () => {
    const classRunners = [
      runnerWith({}),
      runnerWith({}),
      runnerWith({ status_code: RESULT_STATUS.mp }),
      runnerWith({ status_code: RESULT_STATUS.dns, finish_time: null }),
      runnerWith({ finish_time: null }),
    ]
    expect(classSize(classRunners)).toBe(2)
  })

  it("is unknown while the class is not loaded", () => {
    expect(classSize(null)).toBeNull()
  })
})

describe("isBestPosition", () => {
  it("is true only for the first position", () => {
    expect(isBestPosition(1)).toBe(true)
    expect(isBestPosition(2)).toBe(false)
    expect(isBestPosition(null)).toBe(false)
  })
})

describe("isFinishOrder", () => {
  it("is the finish only", () => {
    expect(isFinishOrder(Infinity)).toBe(true)
    expect(isFinishOrder(3)).toBe(false)
    expect(isFinishOrder(null)).toBe(false)
  })
})

describe("isMissedSplit", () => {
  it("is a control without a punch reading", () => {
    expect(isMissedSplit({ ...SPLIT, reading_time: null })).toBe(true)
  })

  it("is not a punched control", () => {
    expect(isMissedSplit(SPLIT)).toBe(false)
  })

  it("is never the finish", () => {
    expect(isMissedSplit({ ...SPLIT, reading_time: null, order_number: Infinity })).toBe(false)
  })
})

describe("isRankedResult", () => {
  it("ranks a correct result", () => {
    expect(isRankedResult(RESULT)).toBe(true)
  })

  it("does not rank a mispunch or a not competitive runner", () => {
    expect(isRankedResult({ ...RESULT, status_code: RESULT_STATUS.mp })).toBe(false)
    expect(isRankedResult({ ...RESULT, status_code: RESULT_STATUS.nc })).toBe(false)
  })
})

describe("isTimeInvalidated", () => {
  it("strikes the time of a mispunch, disqualification, retirement or overtime", () => {
    expect(isTimeInvalidated(RESULT_STATUS_TEXT.mp)).toBe(true)
    expect(isTimeInvalidated(RESULT_STATUS_TEXT.dsq)).toBe(true)
    expect(isTimeInvalidated(RESULT_STATUS_TEXT.dnf)).toBe(true)
    expect(isTimeInvalidated(RESULT_STATUS_TEXT.ot)).toBe(true)
  })

  it("keeps the time of a not competitive runner", () => {
    expect(isTimeInvalidated(RESULT_STATUS_TEXT.nc)).toBe(false)
  })
})

describe("resultStatus", () => {
  it("reads the status code as text", () => {
    expect(resultStatus({ ...RESULT, status_code: RESULT_STATUS.dns })).toBe(RESULT_STATUS_TEXT.dns)
  })
})

describe("splitStandingText", () => {
  it("writes the time behind and the position", () => {
    expect(splitStandingText(8, 4)).toBe("+00:08 (4)")
  })

  it("is empty when either value is unknown", () => {
    expect(splitStandingText(null, 4)).toBeNull()
    expect(splitStandingText(8, null)).toBeNull()
  })
})

describe("statusChipVariant", () => {
  it("is red for a mispunch", () => {
    expect(statusChipVariant(RESULT_STATUS_TEXT.mp)).toBe(STATUS_CHIP_VARIANT.Error)
  })

  it("is neutral for any other status", () => {
    expect(statusChipVariant(RESULT_STATUS_TEXT.dns)).toBe(STATUS_CHIP_VARIANT.Neutral)
  })
})

describe("statusLabelKey", () => {
  it("points at the full name of the status", () => {
    expect(statusLabelKey(RESULT_STATUS_TEXT.dns)).toBe("ResultsStage.VirtualTicket.Status.dns")
  })
})

describe("teamMemberNames", () => {
  const team = { runners: [{ full_name: "Ana" }, { full_name: "Pablo" }] } as ProcessedRunnerModel

  it("joins the names of the members", () => {
    expect(teamMemberNames(team)).toBe("Ana · Pablo")
  })

  it("is empty for a runner without team members", () => {
    expect(teamMemberNames({ ...team, runners: [] as ProcessedTeamRunnerModel[] })).toBeNull()
    expect(teamMemberNames({ ...team, runners: null })).toBeNull()
  })
})

describe("timeOfDayText", () => {
  it("writes the time of day", () => {
    expect(timeOfDayText("2025-10-26T09:40:46.000+00:00")).toBe("09:40:46")
  })

  it("is a dash when unknown", () => {
    expect(timeOfDayText(null)).toBe(EMPTY_VALUE)
  })
})

describe("unrankedTimeText", () => {
  it("writes the time the runner ran", () => {
    expect(unrankedTimeText(RESULT)).toBe("40:46")
  })

  it("is empty without a finish", () => {
    expect(unrankedTimeText({ ...RESULT, finish_time: null })).toBeNull()
    expect(unrankedTimeText({ ...RESULT, time_seconds: 0 })).toBeNull()
  })
})
