import type { ReactNode } from "react"
import * as Sentry from "@sentry/react"
import type { ErrorBoundaryProps, FallbackRender } from "@sentry/react"
import GeneralErrorFallback from "../GeneralErrorFallback.tsx"
import { ChunkLoadError } from "../../services/lazyLoad.ts"
import FailedToLoadAlert from "./components/FailToLoadAlert/FaildToLoadAlert.tsx"

interface Props extends ErrorBoundaryProps {
  displayMsg?: boolean
}

type SentryState = InstanceType<typeof Sentry.ErrorBoundary>["state"]

type State =
  | (Extract<SentryState, { error: null }> & { hasError: false })
  | (Extract<SentryState, { error: unknown }> & { hasError: true })

const SESSION_STORAGE_KEY = "chunk_reload_attempted"

const INITIAL_STATE: State = {
  hasError: false,
  componentStack: null,
  error: null,
  eventId: null,
}

/**
 * An error boundary that extends Sentry's `ErrorBoundary` with automatic chunk error recovery.
 *
 * Handles two categories of errors:
 * - **Chunk load errors** (`ChunkLoadError` or dynamic import failures) — automatically attempts
 *   a one-time page reload to recover. If the error persists after reload, falls back to
 *   `GeneralErrorFallback`. The reload attempt is tracked in `sessionStorage` to prevent
 *   infinite reload loops.
 * - **All other errors** — captured and reported to Sentry via `super.componentDidCatch`,
 *   then renders `GeneralErrorFallback`.
 *
 * @extends {Sentry.ErrorBoundary}
 *
 * @example
 * // Basic usage — wraps a route outlet, shows fallback on error
 * <ErrorBoundary>
 *   <Outlet />
 * </ErrorBoundary>
 *
 * @example
 * // With displayMsg — shows a user-facing error message in the fallback
 * <ErrorBoundary displayMsg>
 *   <Outlet />
 * </ErrorBoundary>
 *
 * @example
 * // With Sentry's beforeCapture — attach extra context to the Sentry event
 * <ErrorBoundary
 *   displayMsg
 *   beforeCapture={(scope) => {
 *     scope.setTag("section", "dashboard")
 *   }}
 * >
 *   <Outlet />
 * </ErrorBoundary>
 *
 * @example
 * // With onError — side effects when an error is caught
 * <ErrorBoundary onError={(error) => analytics.track("error", { error })}>
 *   <Outlet />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Sentry.ErrorBoundary {
  declare props: Props
  state: State = INITIAL_STATE

  static getDerivedStateFromError(error: Error): State {
    const isChunkLoadError = error instanceof ChunkLoadError

    if (isChunkLoadError) {
      console.debug("Chunk error caught while fetching dynamically imported module")
      const hasReloaded = sessionStorage.getItem(SESSION_STORAGE_KEY) === "true"

      if (!hasReloaded) {
        console.debug("Triggering page reload from chunk reload")
        sessionStorage.setItem(SESSION_STORAGE_KEY, "true")
        window.location.reload()

        return INITIAL_STATE
      }
    }

    return {
      hasError: true,
      componentStack: null,
      error,
      eventId: "",
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    super.componentDidUpdate?.(prevProps, prevState)
    if (prevState.hasError && !this.state.hasError) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
  }

  render(): ReactNode {
    const { hasError, error } = this.state
    const { displayMsg, children } = this.props

    if (hasError) {
      if (error instanceof ChunkLoadError) {
        return <FailedToLoadAlert />
      }
      return <GeneralErrorFallback displayMsg={displayMsg} />
    }

    if (typeof children === "function") {
      return (children as FallbackRender)({
        error: this.state.error,
        componentStack: this.state.componentStack ?? "",
        eventId: this.state.eventId ?? "",
        resetError: () => this.setState(INITIAL_STATE),
      })
    }

    return children
  }
}

export default ErrorBoundary
