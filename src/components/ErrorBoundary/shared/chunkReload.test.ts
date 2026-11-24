import { beforeEach, describe, expect, it } from "vitest"
import { ChunkLoadError } from "../../../services/lazyLoad.ts"
import {
  clearChunkReloadAttempt,
  hasAttemptedChunkReload,
  markChunkReloadAttempt,
  shouldReloadForChunkError,
} from "./chunkReload.ts"

describe("shouldReloadForChunkError", () => {
  const chunkError = new ChunkLoadError("https://example.com/assets/Page.js")

  it("reloads on the first chunk load error", () => {
    expect(shouldReloadForChunkError(chunkError, false)).toBe(true)
  })

  it("does not reload again once a reload was attempted", () => {
    expect(shouldReloadForChunkError(chunkError, true)).toBe(false)
  })

  it("does not reload for other errors", () => {
    expect(shouldReloadForChunkError(new Error("render failed"), false)).toBe(false)
  })
})

describe("chunk reload attempt", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("is not attempted by default", () => {
    expect(hasAttemptedChunkReload()).toBe(false)
  })

  it("is remembered once marked", () => {
    markChunkReloadAttempt()

    expect(hasAttemptedChunkReload()).toBe(true)
  })

  it("is forgotten once cleared", () => {
    markChunkReloadAttempt()
    clearChunkReloadAttempt()

    expect(hasAttemptedChunkReload()).toBe(false)
  })
})
