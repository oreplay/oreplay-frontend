import { describe, expect, it } from "vitest"
import {
  ProcessedRunnerResultModel,
  ProcessedSplitModel,
} from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  ROGAINE_TICKET_TAB,
  bonusPenaltyText,
  hasScore,
  pointsText,
  punchedControls,
  rogaineTicketPanelId,
  rogaineTicketTabId,
} from "./rogaineTicket.ts"

const RESULT = {
  finish_time: "2025-10-26T12:58:12.000+00:00",
  points_bonus: 40,
  points_final: 1240,
  points_penalty: -20,
} as ProcessedRunnerResultModel

const EMPTY_RESULT = { ...RESULT, finish_time: null, points_final: 0 }

/**
 * Split at a control with the given station.
 *
 * @param station Code of the control; `null` for a split without control.
 * @returns The split.
 */
function splitAt(station: string | null): ProcessedSplitModel {
  const control = station ? { id: station, station } : null
  return { control } as ProcessedSplitModel
}

describe("bonusPenaltyText", () => {
  it("writes the bonus and the penalty", () => {
    expect(bonusPenaltyText(RESULT)).toBe("+40 / -20")
  })

  it("is empty without points nor finish", () => {
    expect(bonusPenaltyText(EMPTY_RESULT)).toBe("")
  })
})

describe("hasScore", () => {
  it("is true with points or a finish", () => {
    expect(hasScore(RESULT)).toBe(true)
    expect(hasScore({ ...EMPTY_RESULT, points_final: 10 })).toBe(true)
  })

  it("is false with neither", () => {
    expect(hasScore(EMPTY_RESULT)).toBe(false)
  })
})

describe("pointsText", () => {
  it("writes the final points", () => {
    expect(pointsText(RESULT)).toBe("1240")
  })

  it("is empty without points nor finish", () => {
    expect(pointsText(EMPTY_RESULT)).toBe("")
  })
})

describe("punchedControls", () => {
  it("lists the punched stations in order", () => {
    expect(punchedControls([splitAt("34"), splitAt(null), splitAt("41")])).toEqual([34n, 41n])
  })

  it("is empty without splits", () => {
    expect(punchedControls(null)).toEqual([])
  })
})

describe("rogaineTicketTabId / rogaineTicketPanelId", () => {
  it("builds distinct ids that link a tab with its panel", () => {
    expect(rogaineTicketTabId(ROGAINE_TICKET_TAB.Splits)).not.toBe(
      rogaineTicketPanelId(ROGAINE_TICKET_TAB.Splits),
    )
  })
})
