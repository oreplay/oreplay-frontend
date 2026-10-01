import { act, renderHook } from "@testing-library/react"
import { AxiosError, AxiosHeaders } from "axios"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { postXmlUpload } from "./postXmlUpload.ts"
import { UPLOAD_MESSAGE_LEVEL, UPLOAD_STATUS } from "./uploadEntry.ts"
import { useXmlUploads } from "./useXmlUploads.ts"

vi.mock("./postXmlUpload.ts", () => ({ postXmlUpload: vi.fn() }))

const EVENT_ID = "event-1"
const STAGE_ID = "stage-1"
const REFUSED_MESSAGE = {
  code: "bad_request",
  level: UPLOAD_MESSAGE_LEVEL.error,
  text: "An IOF EntryList cannot be imported yet, upload a StartList",
}

const xml = (name: string) => new File(["<ResultList/>"], name)

const refusedWith = (status: number) =>
  new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    config: { headers: new AxiosHeaders() },
    data: { data: {}, meta: { level: UPLOAD_MESSAGE_LEVEL.error, messages: [REFUSED_MESSAGE] } },
    headers: {},
    status,
    statusText: "",
  })

const uploadWithHook = async (files: File[]) => {
  const { result } = renderHook(() => useXmlUploads(EVENT_ID))
  await act(() => result.current.upload(files, STAGE_ID))
  return result
}

describe("useXmlUploads", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("uploads every file in order and records the result", async () => {
    vi.mocked(postXmlUpload).mockResolvedValue({
      data: {},
      meta: { level: UPLOAD_MESSAGE_LEVEL.info, updated: { classes: 2, runners: 10 } },
    })
    const first = xml("start.xml")
    const second = xml("results.xml")

    const result = await uploadWithHook([first, second])

    expect(vi.mocked(postXmlUpload).mock.calls).toEqual([
      [EVENT_ID, STAGE_ID, first],
      [EVENT_ID, STAGE_ID, second],
    ])
    expect(result.current.entries.map((entry) => [entry.fileName, entry.status])).toEqual([
      ["start.xml", UPLOAD_STATUS.done],
      ["results.xml", UPLOAD_STATUS.done],
    ])
    expect(result.current.entries[0].meta?.updated).toEqual({ classes: 2, runners: 10 })
    expect(result.current.isUploading).toBe(false)
  })

  it("keeps uploading the remaining files after one is refused", async () => {
    vi.mocked(postXmlUpload)
      .mockRejectedValueOnce(refusedWith(400))
      .mockResolvedValueOnce({ data: {}, meta: { level: UPLOAD_MESSAGE_LEVEL.info } })

    const result = await uploadWithHook([xml("entries.xml"), xml("results.xml")])

    const [refused, accepted] = result.current.entries
    expect(refused.status).toBe(UPLOAD_STATUS.failed)
    expect(refused.errorKey).toBe("common:error.badRequest")
    expect(refused.meta?.messages).toEqual([REFUSED_MESSAGE])
    expect(accepted.status).toBe(UPLOAD_STATUS.done)
  })

  it("reports a forbidden upload with the generic permission message", async () => {
    vi.mocked(postXmlUpload).mockRejectedValue(refusedWith(403))

    const result = await uploadWithHook([xml("results.xml")])

    expect(result.current.entries[0]).toMatchObject({
      status: UPLOAD_STATUS.failed,
      errorKey: "common:error.forbidden",
    })
  })
})
