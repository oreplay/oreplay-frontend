import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import * as Sentry from "@sentry/react"
import ErrorBoundary from "./ErrorBoundary.tsx"
import { ChunkLoadError } from "../../services/lazyLoad.ts"
import { CHUNK_RELOAD_COOLDOWN, markChunkReloadAttempt } from "./shared/chunkReload.ts"
import { DateTime } from "luxon"

const reload = vi.fn()

/**
 * Stops jsdom from printing the errors React rethrows in development, which the tests expect.
 *
 * @param event The error event dispatched on the window.
 */
function silenceExpectedError(event: ErrorEvent): void {
  event.preventDefault()
}

/**
 * Throws the given error while rendering, to trigger the surrounding boundary.
 *
 * @param props.error The error to throw.
 */
function Thrower(props: { error: Error }): never {
  throw props.error
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    sessionStorage.clear()
    window.addEventListener("error", silenceExpectedError)
    reload.mockClear()
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    vi.spyOn(window, "location", "get").mockReturnValue({ ...window.location, reload })
  })

  afterEach(() => {
    window.removeEventListener("error", silenceExpectedError)
    vi.restoreAllMocks()
  })

  it("reloads on a first chunk load error without reporting it", () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <Thrower error={new ChunkLoadError("https://example.com/assets/Page.js")} />
      </ErrorBoundary>,
    )

    expect(reload).toHaveBeenCalledTimes(1)
    expect(onError).not.toHaveBeenCalled()
  })

  it("reloads again on a chunk load error after the cooldown, as after a later deploy", () => {
    markChunkReloadAttempt(DateTime.now().minus(CHUNK_RELOAD_COOLDOWN))
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <Thrower error={new ChunkLoadError("https://example.com/assets/Page.js")} />
      </ErrorBoundary>,
    )

    expect(reload).toHaveBeenCalledTimes(1)
    expect(onError).not.toHaveBeenCalled()
  })

  it("reports a chunk load error that persists after the reload", () => {
    markChunkReloadAttempt()
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <Thrower error={new ChunkLoadError("https://example.com/assets/Page.js")} />
      </ErrorBoundary>,
    )

    expect(reload).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(screen.getByText("FailedToLoad.title")).toBeInTheDocument()
  })

  it("reports any other error without reloading", () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <Thrower error={new Error("render failed")} />
      </ErrorBoundary>,
    )

    expect(reload).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(screen.getByText("GeneralErrorFallback.title")).toBeInTheDocument()
  })

  describe("reported events", () => {
    const sentEvents: Sentry.ErrorEvent[] = []

    beforeAll(() => {
      Sentry.init({
        dsn: "https://public@o0.ingest.sentry.io/0",
        defaultIntegrations: false,
        sendClientReports: false,
        beforeSend: (event) => {
          sentEvents.push(event)
          return null
        },
      })
    })

    afterEach(() => {
      sentEvents.length = 0
    })

    /**
     * Returns whether Sentry marked the boundary's error as handled.
     *
     * @returns The `handled` flag of the first event's exception mechanism, or `undefined` when
     * no event was sent.
     */
    function reportedAsHandled(): boolean | undefined {
      return sentEvents[0]?.exception?.values?.at(-1)?.mechanism?.handled
    }

    it("reports caught errors as handled by default", async () => {
      render(
        <ErrorBoundary>
          <Thrower error={new Error("render failed")} />
        </ErrorBoundary>,
      )

      await vi.waitFor(() => expect(sentEvents).toHaveLength(1))
      expect(reportedAsHandled()).toBe(true)
    })

    it("lets a caller report caught errors as unhandled", async () => {
      render(
        <ErrorBoundary handled={false}>
          <Thrower error={new Error("render failed")} />
        </ErrorBoundary>,
      )

      await vi.waitFor(() => expect(sentEvents).toHaveLength(1))
      expect(reportedAsHandled()).toBe(false)
    })
  })
})
