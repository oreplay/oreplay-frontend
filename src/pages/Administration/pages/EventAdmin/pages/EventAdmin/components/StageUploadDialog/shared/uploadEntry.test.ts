import { AxiosError, AxiosHeaders } from "axios"
import { describe, expect, it } from "vitest"
import { ResUploadedV2 } from "../../../../../../../../../domain/types/v1api"
import {
  failedUploadMeta,
  messagesOf,
  pendingEntry,
  severityOf,
  statusKeyOf,
  updatedCountsOf,
  UPLOAD_MESSAGE_LEVEL,
  UPLOAD_STATUS,
  UploadEntry,
  withChanges,
  withUnfinishedCancelled,
} from "./uploadEntry.ts"

const entry = (changes: Partial<UploadEntry> = {}): UploadEntry => ({
  fileName: "results.xml",
  id: "1",
  status: UPLOAD_STATUS.pending,
  ...changes,
})

const REFUSED_MESSAGE = {
  code: "bad_request",
  level: UPLOAD_MESSAGE_LEVEL.error,
  text: "An IOF EntryList cannot be imported yet, upload a StartList",
}

const axiosErrorWith = (status: number, data: ResUploadedV2) =>
  new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    config: { headers: new AxiosHeaders() },
    data,
    headers: {},
    status,
    statusText: "",
  })

describe("pendingEntry", () => {
  it("starts the file as pending, named after it", () => {
    expect(pendingEntry("7", new File([""], "start.xml"))).toEqual({
      fileName: "start.xml",
      id: "7",
      status: UPLOAD_STATUS.pending,
    })
  })
})

describe("withChanges", () => {
  it("changes only the entry with the given id", () => {
    const first = entry({ id: "1" })
    const second = entry({ id: "2" })

    expect(withChanges([first, second], "2", { status: UPLOAD_STATUS.uploading })).toEqual([
      first,
      { ...second, status: UPLOAD_STATUS.uploading },
    ])
  })
})

describe("withUnfinishedCancelled", () => {
  it("cancels the files still waiting or uploading and keeps the finished ones", () => {
    const statusesAfterCancelling = withUnfinishedCancelled([
      entry({ status: UPLOAD_STATUS.done }),
      entry({ status: UPLOAD_STATUS.failed }),
      entry({ status: UPLOAD_STATUS.uploading }),
      entry({ status: UPLOAD_STATUS.pending }),
    ]).map(({ status }) => status)

    expect(statusesAfterCancelling).toEqual([
      UPLOAD_STATUS.done,
      UPLOAD_STATUS.failed,
      UPLOAD_STATUS.cancelled,
      UPLOAD_STATUS.cancelled,
    ])
  })
})

describe("severityOf", () => {
  it("is informative while the file waits or uploads", () => {
    expect(severityOf(entry())).toBe("info")
    expect(severityOf(entry({ status: UPLOAD_STATUS.uploading }))).toBe("info")
  })

  it("is an error when the upload failed", () => {
    expect(severityOf(entry({ status: UPLOAD_STATUS.failed }))).toBe("error")
  })

  it("is a warning when the upload was cancelled", () => {
    expect(severityOf(entry({ status: UPLOAD_STATUS.cancelled }))).toBe("warning")
  })

  it("follows the level the backend reports for a finished upload", () => {
    const done = (level?: string) => entry({ status: UPLOAD_STATUS.done, meta: { level } })

    expect(severityOf(done(UPLOAD_MESSAGE_LEVEL.info))).toBe("success")
    expect(severityOf(done(UPLOAD_MESSAGE_LEVEL.warning))).toBe("warning")
    expect(severityOf(done(UPLOAD_MESSAGE_LEVEL.error))).toBe("error")
    expect(severityOf(done())).toBe("success")
  })
})

describe("statusKeyOf", () => {
  it("uses the translation key of the status", () => {
    expect(statusKeyOf(entry({ status: UPLOAD_STATUS.uploading }))).toBe(
      "EventAdmin.DataUpload.status.uploading",
    )
  })

  it("prefers the error key of a failed upload", () => {
    expect(
      statusKeyOf(entry({ status: UPLOAD_STATUS.failed, errorKey: "common:error.forbidden" })),
    ).toBe("common:error.forbidden")
  })
})

describe("updatedCountsOf", () => {
  it("reads the classes and runners the backend updated", () => {
    const done = entry({ meta: { updated: { classes: 3, runners: 42, splits: 9 } } })

    expect(updatedCountsOf(done)).toEqual({ classes: 3, runners: 42 })
  })

  it("counts zero when the backend reported nothing", () => {
    expect(updatedCountsOf(entry())).toEqual({ classes: 0, runners: 0 })
  })
})

describe("messagesOf", () => {
  it("returns the backend messages, or none", () => {
    expect(messagesOf(entry({ meta: { messages: [REFUSED_MESSAGE] } }))).toEqual([REFUSED_MESSAGE])
    expect(messagesOf(entry())).toEqual([])
  })
})

describe("failedUploadMeta", () => {
  it("reads the meta the backend sends with a refused upload", () => {
    const meta = { level: UPLOAD_MESSAGE_LEVEL.error, messages: [REFUSED_MESSAGE] }

    expect(failedUploadMeta(axiosErrorWith(400, { data: {}, meta }))).toEqual(meta)
  })

  it("is undefined for anything that is not an HTTP error", () => {
    expect(failedUploadMeta(new Error("offline"))).toBeUndefined()
  })
})
