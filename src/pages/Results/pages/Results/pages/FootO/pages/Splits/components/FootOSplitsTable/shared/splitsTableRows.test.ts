import { describe, expect, it } from "vitest"
import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../../../../../../../../../shared/constants.ts"
import { UPLOAD_TYPES } from "../../../../../../../shared/constants.ts"
import { buildRunnerFixture, FIXTURE_LEGS } from "./splitsTableFixtures.ts"
import {
  buildSplitsTableRows,
  getSplitsTableRowKey,
  isRadioSplit,
  selectRunnersForSplitsTable,
} from "./splitsTableRows.ts"

const RADIOS: OnlineControlModel[] = [{ id: "radio1", station: "41" }]
const FINISH_SPLIT_COUNT = 1

function withFinishSplit(runner: ProcessedRunnerModel): ProcessedRunnerModel {
  const lastSplit = runner.stage.splits[runner.stage.splits.length - 1]
  const finishSplit = { ...lastSplit, control: null, id: "finish" }
  return { ...runner, stage: { ...runner.stage, splits: [...runner.stage.splits, finishSplit] } }
}

describe("buildSplitsTableRows", () => {
  it("keeps the splits of each runner when every control is shown", () => {
    const runner = buildRunnerFixture("anna")

    const [row] = buildSplitsTableRows([runner], false, RADIOS)

    expect(row.runner).toBe(runner)
    expect(row.splits).toBe(runner.stage.splits)
  })

  it("keeps one split per radio control plus the finish when only radios are shown", () => {
    const runner = withFinishSplit(buildRunnerFixture("anna"))

    const [row] = buildSplitsTableRows([runner], true, RADIOS)

    expect(row.splits).toHaveLength(RADIOS.length + FINISH_SPLIT_COUNT)
    expect(row.splits.every(isRadioSplit)).toBe(true)
  })
})

describe("getSplitsTableRowKey", () => {
  it("identifies a row by its runner", () => {
    const [row] = buildSplitsTableRows([buildRunnerFixture("anna")], false, RADIOS)

    expect(getSplitsTableRowKey(row)).toBe("anna")
  })
})

describe("isRadioSplit", () => {
  it("is false for a split read from the chip", () => {
    const [split] = buildRunnerFixture("anna").stage.splits

    expect(isRadioSplit(split)).toBe(false)
  })
})

describe("selectRunnersForSplitsTable", () => {
  const downloaded = buildRunnerFixture("downloaded")
  const notStarted = buildRunnerFixture("notStarted", FIXTURE_LEGS, {
    statusCode: RESULT_STATUS.dns,
  })
  const onlyRadioPunches = buildRunnerFixture("onlyRadioPunches", FIXTURE_LEGS, {
    uploadType: UPLOAD_TYPES.ONLINE_SPLITS,
  })
  const runners = [downloaded, notStarted, onlyRadioPunches]

  it("keeps only the runners who downloaded their chip when every control is shown", () => {
    expect(selectRunnersForSplitsTable(runners, false)).toEqual([downloaded])
  })

  it("keeps every runner who started when only radios are shown", () => {
    expect(selectRunnersForSplitsTable(runners, true)).toEqual([downloaded, onlyRadioPunches])
  })
})
