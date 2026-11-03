import { describe, expect, it } from "vitest"
import { closeConfirmationKeysOf } from "./closeConfirmation.ts"

describe("closeConfirmationKeysOf", () => {
  it("asks to stop listening while a folder is listened to", () => {
    expect(closeConfirmationKeysOf(true).title).toBe("EventAdmin.DataUpload.stopListening.title")
  })

  it("asks to cancel the upload otherwise", () => {
    expect(closeConfirmationKeysOf(false).title).toBe("EventAdmin.DataUpload.cancelUpload.title")
  })
})
