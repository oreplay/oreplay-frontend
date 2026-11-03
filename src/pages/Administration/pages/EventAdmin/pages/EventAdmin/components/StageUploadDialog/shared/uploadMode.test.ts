import { describe, expect, it } from "vitest"
import { modeLabelKeyOf, UPLOAD_MODE } from "./uploadMode.ts"

describe("modeLabelKeyOf", () => {
  it("points to the mode's tab label", () => {
    expect(modeLabelKeyOf(UPLOAD_MODE.listen)).toBe("EventAdmin.DataUpload.mode.listen")
  })
})
