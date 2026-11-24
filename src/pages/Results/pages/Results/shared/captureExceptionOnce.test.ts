import { beforeEach, describe, expect, it, vi } from "vitest"
import { captureException } from "@sentry/react"
import { captureExceptionOnce } from "./captureExceptionOnce.ts"

vi.mock("@sentry/react", () => ({
  captureException: vi.fn(),
  withScope: (callback: (scope: { setExtras: () => void }) => void) =>
    callback({ setExtras: vi.fn() }),
}))

describe("captureExceptionOnce", () => {
  beforeEach(() => {
    vi.mocked(captureException).mockClear()
  })

  it("reports the same error from the same origin only once", () => {
    captureExceptionOnce(new Error("repeated"), "origin.repeated")
    captureExceptionOnce(new Error("repeated"), "origin.repeated")

    expect(captureException).toHaveBeenCalledTimes(1)
  })

  it("reports the same message from different origins separately", () => {
    captureExceptionOnce(new Error("shared"), "origin.first")
    captureExceptionOnce(new Error("shared"), "origin.second")

    expect(captureException).toHaveBeenCalledTimes(2)
  })

  it("reports different messages from the same origin separately", () => {
    captureExceptionOnce(new Error("first"), "origin.messages")
    captureExceptionOnce(new Error("second"), "origin.messages")

    expect(captureException).toHaveBeenCalledTimes(2)
  })

  it("reports thrown values that are not errors", () => {
    captureExceptionOnce("plain string", "origin.string")

    expect(captureException).toHaveBeenCalledWith("plain string")
  })
})
