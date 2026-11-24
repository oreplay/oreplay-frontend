import type { ErrorInfo, ReactNode } from "react"
import * as Sentry from "@sentry/react"
import type { ErrorBoundaryProps, FallbackRender } from "@sentry/react"
import GeneralErrorFallback from "../GeneralErrorFallback.tsx"
import { ChunkLoadError } from "../../services/lazyLoad.ts"
import FailedToLoadAlert from "./components/FailedToLoadAlert/FailedToLoadAlert.tsx"
import {
  clearChunkReloadAttempt,
  hasAttemptedChunkReload,
  markChunkReloadAttempt,
  shouldReloadForChunkError,
} from "./shared/chunkReload.ts"

interface Props extends ErrorBoundaryProps {
  displayMsg?: boolean
}

type SentryState = InstanceType<typeof Sentry.ErrorBoundary>["state"]

type State =
  | (Extract<SentryState, { error: null }> & { hasError: false })
  | (Extract<SentryState, { error: unknown }> & { hasError: true })

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
 * - **Chunk load errors** (`ChunkLoadError`) — automatically attempts a one-time page reload to
 *   recover, without reporting the error: it is expected after a deploy and the reload fixes it.
 *   If the error persists after the reload, it is reported to Sentry and `FailedToLoadAlert` is
 *   shown. The reload attempt is tracked in `sessionStorage` to prevent infinite reload loops.
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

  /**
   * Switches the boundary to its error state, which renders the fallback instead of the children.
   *
   * @param error The error thrown while rendering the children.
   * @returns The error state holding `error`.
   */
  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      componentStack: null,
      error,
      eventId: "",
    }
  }

  /**
   * Reloads the page on a first chunk load error, without reporting it; reports any other error
   * to Sentry.
   *
   * @param error The error thrown while rendering the children.
   * @param errorInfo React's information about the error, including the component stack.
   */
  componentDidCatch(error: unknown, errorInfo: ErrorInfo): void {
    if (shouldReloadForChunkError(error, hasAttemptedChunkReload())) {
      markChunkReloadAttempt()
      window.location.reload()
      return
    }

    super.componentDidCatch(error, errorInfo)
  }

  /**
   * Forgets the chunk reload attempt once the boundary recovers from an error.
   *
   * @param prevProps The props before the update.
   * @param prevState The state before the update.
   */
  componentDidUpdate(prevProps: Props, prevState: State): void {
    super.componentDidUpdate?.(prevProps, prevState)
    if (prevState.hasError && !this.state.hasError) {
      clearChunkReloadAttempt()
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
