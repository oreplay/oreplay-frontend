import { describe, expect, it } from "vitest"
import { RESULT_STATUS, RESULT_STATUS_TEXT } from "../../../shared/constants.ts"
import { buildRunnerFixture } from "../pages/FootO/pages/Splits/components/FootOSplitsTable/shared/splitsTableFixtures.ts"
import {
  getRacePositionAlign,
  getRacePositionColor,
  getRacePositionDisplay,
  getRunnerRacePosition,
  toResultStatusText,
} from "./racePosition.ts"

describe("getRunnerRacePosition", () => {
  it("reads the stage result", () => {
    const runner = buildRunnerFixture("a", undefined, { statusCode: RESULT_STATUS.mp })
    expect(getRunnerRacePosition(runner)).toEqual({
      position: 1,
      statusCode: RESULT_STATUS.mp,
      isNC: false,
    })
  })
})

describe("getRacePositionDisplay", () => {
  it("shows the position of a classified runner", () => {
    expect(getRacePositionDisplay(3, RESULT_STATUS.ok, false)).toBe("position")
  })

  it("shows a pending dash when the position is not available yet", () => {
    expect(getRacePositionDisplay(null, null, false)).toBe("pending")
    expect(getRacePositionDisplay(0, RESULT_STATUS.ok, false)).toBe("pending")
    expect(getRacePositionDisplay(undefined, undefined, undefined)).toBe("pending")
  })

  it.each([
    RESULT_STATUS.dns,
    RESULT_STATUS.dnf,
    RESULT_STATUS.mp,
    RESULT_STATUS.dsq,
    RESULT_STATUS.ot,
    RESULT_STATUS_TEXT.mp,
  ])("shows a cross for the not-ok status %s", (status) => {
    expect(getRacePositionDisplay(null, status, false)).toBe("notOk")
  })

  it("prefers the cross over a stale position", () => {
    expect(getRacePositionDisplay(4, RESULT_STATUS.mp, false)).toBe("notOk")
  })

  it("shows NC before anything else", () => {
    expect(getRacePositionDisplay(2, RESULT_STATUS.mp, true)).toBe("nc")
    expect(getRacePositionDisplay(null, RESULT_STATUS.nc, true)).toBe("nc")
  })
})

describe("getRacePositionAlign", () => {
  it("centres the symbols and right-aligns numbers and NC", () => {
    expect(getRacePositionAlign("notOk")).toBe("center")
    expect(getRacePositionAlign("pending")).toBe("center")
    expect(getRacePositionAlign("position")).toBe("end")
    expect(getRacePositionAlign("nc")).toBe("end")
  })
})

describe("getRacePositionColor", () => {
  it("highlights NC and final positions, dims the cross", () => {
    expect(getRacePositionColor("nc", false)).toBe("primary.main")
    expect(getRacePositionColor("position", true)).toBe("primary.main")
    expect(getRacePositionColor("position", false)).toBe("text.secondary")
    expect(getRacePositionColor("notOk", true)).toBe("text.disabled")
    expect(getRacePositionColor("pending", true)).toBe("text.secondary")
  })
})

describe("toResultStatusText", () => {
  it("normalises numeric codes and keeps texts", () => {
    expect(toResultStatusText(RESULT_STATUS.mp)).toBe(RESULT_STATUS_TEXT.mp)
    expect(toResultStatusText(RESULT_STATUS_TEXT.dsq)).toBe(RESULT_STATUS_TEXT.dsq)
    expect(toResultStatusText(null)).toBeNull()
  })
})
