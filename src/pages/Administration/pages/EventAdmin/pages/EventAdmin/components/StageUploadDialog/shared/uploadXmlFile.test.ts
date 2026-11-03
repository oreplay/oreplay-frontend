import { describe, expect, it } from "vitest"
import { UPLOAD_MESSAGE_LEVEL, UPLOAD_STATUS } from "./uploadEntry.ts"
import { isUploadAccepted } from "./uploadXmlFile.ts"

describe("isUploadAccepted", () => {
  it("accepts an upload done with warnings", () => {
    const outcome = { status: UPLOAD_STATUS.done, meta: { level: UPLOAD_MESSAGE_LEVEL.warning } }

    expect(isUploadAccepted(outcome)).toBe(true)
  })

  it("refuses an upload the server answered with an error", () => {
    const outcome = { status: UPLOAD_STATUS.done, meta: { level: UPLOAD_MESSAGE_LEVEL.error } }

    expect(isUploadAccepted(outcome)).toBe(false)
  })

  it("refuses a failed upload", () => {
    expect(isUploadAccepted({ status: UPLOAD_STATUS.failed })).toBe(false)
  })

  it("refuses an aborted upload", () => {
    expect(isUploadAccepted(null)).toBe(false)
  })
})
