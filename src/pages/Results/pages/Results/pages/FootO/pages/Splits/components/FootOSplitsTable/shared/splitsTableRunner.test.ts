import { describe, expect, it } from "vitest"
import { RESULT_STATUS, RESULT_STATUS_TEXT } from "../../../../../../../../../shared/constants.ts"
import { UPLOAD_TYPES } from "../../../../../../../shared/constants.ts"
import { FINISH_LEG_ID } from "../../../../../shared/timeLossAnalysis.ts"
import {
  buildRunnerFixture,
  buildTimeLossResultsFixture,
  FIXTURE_LEGS,
} from "./splitsTableFixtures.ts"
import {
  calculateTotalLossTime,
  getRunnerCleanTimeLabel,
  getRunnerStatus,
  getSplitTimeLoss,
  isRunnerNotCompeting,
  isRunnerOkOrNotCompeting,
  NO_CLEAN_TIME_LABEL,
  showsRunnerTimeBehind,
} from "./splitsTableRunner.ts"

const RACE_TIME_SECONDS = 270

describe("calculateTotalLossTime", () => {
  const runner = buildRunnerFixture("anna")

  it("is zero without a time loss analysis", () => {
    expect(calculateTotalLossTime(runner, null)).toBe(0)
  })

  it("adds the loss of every leg, including the finish leg", () => {
    const results = buildTimeLossResultsFixture("anna", {
      control31: 10,
      control51: 5,
      [FINISH_LEG_ID]: 3,
    })

    expect(calculateTotalLossTime(runner, results)).toBe(18)
  })

  it("ignores the loss of other runners", () => {
    const results = buildTimeLossResultsFixture("bea", { control31: 10 })

    expect(calculateTotalLossTime(runner, results)).toBe(0)
  })
})

describe("getRunnerCleanTimeLabel", () => {
  it("subtracts the lost time from the race time", () => {
    const results = buildTimeLossResultsFixture("anna", { control31: 30 })

    expect(getRunnerCleanTimeLabel(buildRunnerFixture("anna"), results)).toBe("04:00")
  })

  it("shows the race time when nothing was lost", () => {
    expect(getRunnerCleanTimeLabel(buildRunnerFixture("anna"), null)).toBe("04:30")
  })

  it("has no clean time for a runner with a missing punch", () => {
    const runner = buildRunnerFixture("anna", FIXTURE_LEGS, { statusCode: RESULT_STATUS.mp })

    expect(getRunnerCleanTimeLabel(runner, null)).toBe(NO_CLEAN_TIME_LABEL)
  })

  it("has no clean time when the whole race time was lost", () => {
    const results = buildTimeLossResultsFixture("anna", { control31: RACE_TIME_SECONDS })

    expect(getRunnerCleanTimeLabel(buildRunnerFixture("anna"), results)).toBe(NO_CLEAN_TIME_LABEL)
  })

  it("is empty for a runner without a race time", () => {
    expect(getRunnerCleanTimeLabel(buildRunnerFixture("anna", []), null)).toBe("")
  })
})

describe("getRunnerStatus", () => {
  it("translates the status code of the runner", () => {
    const runner = buildRunnerFixture("anna", FIXTURE_LEGS, { statusCode: RESULT_STATUS.dnf })

    expect(getRunnerStatus(runner)).toBe(RESULT_STATUS_TEXT.dnf)
  })
})

describe("getSplitTimeLoss", () => {
  const runner = buildRunnerFixture("anna")
  const [firstSplit, secondSplit] = runner.stage.splits

  it("finds the loss of the runner on the control of the split", () => {
    const results = buildTimeLossResultsFixture("anna", { control31: 12 })

    expect(getSplitTimeLoss(runner, firstSplit, results)?.timeLoss).toBe(12)
  })

  it("is null when the control was not analysed", () => {
    const results = buildTimeLossResultsFixture("anna", { control31: 12 })

    expect(getSplitTimeLoss(runner, secondSplit, results)).toBeNull()
  })

  it("is null without a time loss analysis", () => {
    expect(getSplitTimeLoss(runner, firstSplit, null)).toBeNull()
  })
})

describe("isRunnerNotCompeting", () => {
  it("is true for a not competing status", () => {
    const runner = buildRunnerFixture("anna", FIXTURE_LEGS, { statusCode: RESULT_STATUS.nc })

    expect(isRunnerNotCompeting(runner)).toBe(true)
  })

  it("is true for a runner flagged as not competing", () => {
    expect(isRunnerNotCompeting({ ...buildRunnerFixture("anna"), is_nc: true })).toBe(true)
  })

  it("is false for a regular runner", () => {
    expect(isRunnerNotCompeting(buildRunnerFixture("anna"))).toBe(false)
  })
})

describe("isRunnerOkOrNotCompeting", () => {
  it("is true for a runner with a valid result", () => {
    expect(isRunnerOkOrNotCompeting(buildRunnerFixture("anna"))).toBe(true)
  })

  it("is false for a disqualified runner", () => {
    const runner = buildRunnerFixture("anna", FIXTURE_LEGS, { statusCode: RESULT_STATUS.dsq })

    expect(isRunnerOkOrNotCompeting(runner)).toBe(false)
  })
})

describe("showsRunnerTimeBehind", () => {
  it("is true for a finished runner with a valid result and a chip download", () => {
    expect(showsRunnerTimeBehind(buildRunnerFixture("anna"))).toBe(true)
  })

  it("is false while the runner has only radio punches", () => {
    const runner = buildRunnerFixture("anna", FIXTURE_LEGS, {
      uploadType: UPLOAD_TYPES.ONLINE_SPLITS,
    })

    expect(showsRunnerTimeBehind(runner)).toBe(false)
  })

  it("is false for a runner who did not finish", () => {
    const runner = buildRunnerFixture("anna", FIXTURE_LEGS, { statusCode: RESULT_STATUS.dnf })

    expect(showsRunnerTimeBehind(runner)).toBe(false)
  })
})
