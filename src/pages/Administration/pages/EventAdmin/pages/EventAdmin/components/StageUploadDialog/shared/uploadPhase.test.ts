import { describe, expect, it } from "vitest"
import { UPLOAD_STATUS, UploadEntry } from "./uploadEntry.ts"
import { UPLOAD_PHASE, uploadPhaseOf } from "./uploadPhase.ts"

const done: UploadEntry = { fileName: "results.xml", id: "1", status: UPLOAD_STATUS.done }

describe("uploadPhaseOf", () => {
  it("is selecting while there is nothing uploaded nor uploading", () => {
    expect(uploadPhaseOf([], false)).toBe(UPLOAD_PHASE.selecting)
  })

  it("is uploading while files are being sent", () => {
    expect(uploadPhaseOf([done], true)).toBe(UPLOAD_PHASE.uploading)
  })

  it("is finished once every file has a result", () => {
    expect(uploadPhaseOf([done], false)).toBe(UPLOAD_PHASE.finished)
  })
})
