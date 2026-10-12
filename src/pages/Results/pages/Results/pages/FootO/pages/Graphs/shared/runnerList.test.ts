import { describe, expect, it } from "vitest"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { getAccessibleColor } from "../../../../../../../../../utils/accessibleColors.ts"
import { RESULT_STATUS, RESULT_STATUS_TEXT } from "../../../../../../../shared/constants.ts"
import { UPLOAD_TYPES } from "../../../../../shared/constants.ts"
import {
  areAllRunnersSelected,
  buildRunnerListItems,
  plottedRunnerColors,
  RUNNER_LIST_ITEM_STATE,
  selectableRunnerIds,
  selectedRunnerCount,
  toggleRunnerId,
} from "./runnerList.ts"

const CLUB_NAME = "Club A"

/**
 * Builds a runner with just the fields the runner list reads.
 *
 * @param id Runner id, also used as its name.
 * @param position Position in the class; `0` for a runner that is not classified.
 * @param uploadType How the result was uploaded; decides whether the runner has splits.
 * @returns The runner.
 */
function buildRunner(
  id: string,
  position: number = 1,
  uploadType: string = UPLOAD_TYPES.SPLIT_RESULT,
): ProcessedRunnerModel {
  return {
    club: { short_name: CLUB_NAME },
    full_name: id,
    id,
    stage: { position, upload_type: uploadType },
  } as ProcessedRunnerModel
}

const RUNNERS = [buildRunner("a"), buildRunner("b"), buildRunner("c", 0), buildRunner("d")]

describe("buildRunnerListItems", () => {
  it("lists every runner with its name and club", () => {
    const items = buildRunnerListItems(RUNNERS, [])
    expect(items.map((item) => item.name)).toEqual(["a", "b", "c", "d"])
    expect(items[0].clubName).toBe(CLUB_NAME)
  })

  it("leaves the club empty for a runner without club", () => {
    const runner = { ...buildRunner("a"), club: null }
    expect(buildRunnerListItems([runner], [])[0].clubName).toBeNull()
  })

  it("tells selected, unselected and unavailable runners apart", () => {
    const items = buildRunnerListItems(RUNNERS, ["b"])
    expect(items.map((item) => item.state)).toEqual([
      RUNNER_LIST_ITEM_STATE.Unselected,
      RUNNER_LIST_ITEM_STATE.Selected,
      RUNNER_LIST_ITEM_STATE.Unavailable,
      RUNNER_LIST_ITEM_STATE.Unselected,
    ])
  })

  it("only gives a colour to the plotted runners", () => {
    const items = buildRunnerListItems(RUNNERS, ["d", "b"])
    expect(items.map((item) => item.color)).toEqual([
      undefined,
      getAccessibleColor(0),
      undefined,
      getAccessibleColor(1),
    ])
  })
})

describe("runner status", () => {
  /**
   * Builds the list entry of a single runner with the given result status.
   *
   * @param position Position in the class; `0` for a runner that is not classified.
   * @param statusCode Result status code of the runner.
   * @returns The entry of the runner.
   */
  function buildItemWithStatus(position: number, statusCode: string | null) {
    const runner = buildRunner("a", position)
    const runnerWithStatus = {
      ...runner,
      stage: { ...runner.stage, status_code: statusCode },
    } as ProcessedRunnerModel
    return buildRunnerListItems([runnerWithStatus], [])[0]
  }

  it("shows the status of a runner that cannot be plotted", () => {
    expect(buildItemWithStatus(0, RESULT_STATUS.mp).statusLabelKey).toBe(
      `ResultsStage.statusCodes.${RESULT_STATUS_TEXT.mp}`,
    )
  })

  it("shows no status for a runner that can be plotted", () => {
    expect(buildItemWithStatus(1, RESULT_STATUS.nc).statusLabelKey).toBeNull()
  })

  it("shows no status when an unavailable runner has a regular, unknown or missing one", () => {
    expect(buildItemWithStatus(0, RESULT_STATUS.ok).statusLabelKey).toBeNull()
    expect(buildItemWithStatus(0, "42").statusLabelKey).toBeNull()
    expect(buildItemWithStatus(0, null).statusLabelKey).toBeNull()
  })
})

describe("plottedRunnerColors", () => {
  it("skips selected runners without splits", () => {
    const runners = [buildRunner("a", 1, UPLOAD_TYPES.ONLINE_SPLITS), buildRunner("b")]
    expect([...plottedRunnerColors(runners, ["a", "b"])]).toEqual([["b", getAccessibleColor(0)]])
  })

  it("ignores ids of runners outside the class", () => {
    expect(plottedRunnerColors(RUNNERS, ["other"]).size).toBe(0)
  })
})

describe("areAllRunnersSelected", () => {
  it("is true when every selectable runner is selected", () => {
    expect(areAllRunnersSelected(buildRunnerListItems(RUNNERS, ["a", "b", "d"]))).toBe(true)
  })

  it("is false when a selectable runner is left out", () => {
    expect(areAllRunnersSelected(buildRunnerListItems(RUNNERS, ["a", "b"]))).toBe(false)
  })

  it("is false when no runner can be selected", () => {
    expect(areAllRunnersSelected(buildRunnerListItems([buildRunner("c", 0)], []))).toBe(false)
  })
})

describe("selectableRunnerIds", () => {
  it("leaves out the runners that cannot be plotted", () => {
    expect(selectableRunnerIds(buildRunnerListItems(RUNNERS, []))).toEqual(["a", "b", "d"])
  })
})

describe("selectedRunnerCount", () => {
  it("does not count selected ids of other classes", () => {
    expect(selectedRunnerCount(buildRunnerListItems(RUNNERS, ["a", "other"]))).toBe(1)
  })
})

describe("toggleRunnerId", () => {
  it("adds a runner that was not selected", () => {
    expect(toggleRunnerId(["a"], "b")).toEqual(["a", "b"])
  })

  it("removes a runner that was selected", () => {
    expect(toggleRunnerId(["a", "b"], "a")).toEqual(["b"])
  })
})
