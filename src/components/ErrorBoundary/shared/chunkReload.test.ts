import { beforeEach, describe, expect, it } from "vitest"
import { DateTime } from "luxon"
import { ChunkLoadError } from "../../../services/lazyLoad.ts"
import {
  CHUNK_RELOAD_COOLDOWN,
  clearChunkReloadAttempt,
  lastChunkReloadAttempt,
  markChunkReloadAttempt,
  shouldReloadForChunkError,
} from "./chunkReload.ts"

const NOW = DateTime.fromISO("2026-11-24T10:00:00.000Z")

describe("shouldReloadForChunkError", () => {
  const chunkError = new ChunkLoadError("https://example.com/assets/Page.js")

  it("reloads on the first chunk load error", () => {
    expect(shouldReloadForChunkError(chunkError, null, NOW)).toBe(true)
  })

  it("does not reload again when the last reload is within the cooldown", () => {
    const justReloaded = NOW.minus({ seconds: 5 })

    expect(shouldReloadForChunkError(chunkError, justReloaded, NOW)).toBe(false)
  })

  it("reloads again once the cooldown has passed", () => {
    const reloadedLongAgo = NOW.minus(CHUNK_RELOAD_COOLDOWN)

    expect(shouldReloadForChunkError(chunkError, reloadedLongAgo, NOW)).toBe(true)
  })

  it("does not reload for other errors", () => {
    expect(shouldReloadForChunkError(new Error("render failed"), null, NOW)).toBe(false)
  })
})

describe("chunk reload attempt", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("is not attempted by default", () => {
    expect(lastChunkReloadAttempt()).toBeNull()
  })

  it("remembers when it was marked", () => {
    markChunkReloadAttempt(NOW)

    expect(lastChunkReloadAttempt()?.toMillis()).toBe(NOW.toMillis())
  })

  it("is forgotten once cleared", () => {
    markChunkReloadAttempt(NOW)
    clearChunkReloadAttempt()

    expect(lastChunkReloadAttempt()).toBeNull()
  })

  it("ignores a stored value that is not a time", () => {
    sessionStorage.setItem("chunk_reload_attempted_at", "true")

    expect(lastChunkReloadAttempt()).toBeNull()
  })
})
