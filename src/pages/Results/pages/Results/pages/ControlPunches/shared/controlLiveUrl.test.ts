import { describe, expect, it } from "vitest"
import { API_BASE_URL } from "../../../../../../../services/ApiConfig.ts"
import { getControlLiveUrl } from "./controlLiveUrl.ts"

describe("getControlLiveUrl", () => {
  it("points at the live channel of the stage's control", () => {
    expect(getControlLiveUrl("stage-1", 31)).toBe(`${API_BASE_URL}live/stages/stage-1/controls/31`)
  })
})
