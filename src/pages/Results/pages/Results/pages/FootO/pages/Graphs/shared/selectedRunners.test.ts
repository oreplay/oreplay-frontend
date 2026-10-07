import { describe, expect, it } from "vitest"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { UPLOAD_TYPES } from "../../../../../shared/constants.ts"
import {
  DEFAULT_SELECTED_RUNNERS_COUNT,
  isSelectableRunner,
  parseStoredRunnerIds,
  pickDefaultSelectedRunnerIds,
} from "./selectedRunners.ts"

function buildRunner(
  id: string,
  position: number,
  uploadType: string = UPLOAD_TYPES.SPLIT_RESULT,
): ProcessedRunnerModel {
  return { id, stage: { position, upload_type: uploadType } } as ProcessedRunnerModel
}

describe("isSelectableRunner", () => {
  it("accepts a classified runner whose chip was downloaded", () => {
    expect(isSelectableRunner(buildRunner("a", 1))).toBe(true)
  })

  it("rejects a runner without position", () => {
    expect(isSelectableRunner(buildRunner("a", 0))).toBe(false)
  })

  it("rejects a runner without chip download", () => {
    expect(isSelectableRunner(buildRunner("a", 1, UPLOAD_TYPES.ONLINE_SPLITS))).toBe(false)
  })
})

describe("parseStoredRunnerIds", () => {
  it("returns the stored ids", () => {
    expect(parseStoredRunnerIds('["a","b"]')).toEqual(["a", "b"])
  })

  it("returns no ids when nothing is stored", () => {
    expect(parseStoredRunnerIds(null)).toEqual([])
  })

  it("returns no ids when the stored value is not valid JSON", () => {
    expect(parseStoredRunnerIds("{not json")).toEqual([])
  })

  it("returns no ids when the stored value is not a list of strings", () => {
    expect(parseStoredRunnerIds('{"a":1}')).toEqual([])
    expect(parseStoredRunnerIds("[1,2]")).toEqual([])
  })
})

describe("pickDefaultSelectedRunnerIds", () => {
  it("picks the best placed runners in position order", () => {
    const runners = [buildRunner("third", 3), buildRunner("first", 1), buildRunner("second", 2)]

    expect(pickDefaultSelectedRunnerIds(runners)).toEqual(["first", "second", "third"])
  })

  it("limits the selection to the default count", () => {
    const runners = Array.from({ length: DEFAULT_SELECTED_RUNNERS_COUNT + 2 }, (_, index) =>
      buildRunner(`runner-${index + 1}`, index + 1),
    )

    expect(pickDefaultSelectedRunnerIds(runners)).toEqual([
      "runner-1",
      "runner-2",
      "runner-3",
      "runner-4",
      "runner-5",
    ])
  })

  it("skips runners that cannot be selected", () => {
    const runners = [
      buildRunner("unclassified", 0),
      buildRunner("radio-only", 1, UPLOAD_TYPES.ONLINE_SPLITS),
      buildRunner("downloaded", 2),
    ]

    expect(pickDefaultSelectedRunnerIds(runners)).toEqual(["downloaded"])
  })

  it("leaves the given list untouched", () => {
    const runners = [buildRunner("second", 2), buildRunner("first", 1)]

    pickDefaultSelectedRunnerIds(runners)

    expect(runners.map((runner) => runner.id)).toEqual(["second", "first"])
  })
})
