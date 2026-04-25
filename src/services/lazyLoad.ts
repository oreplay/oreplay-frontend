import type { LazyExoticComponent, ComponentType } from "react"
import { lazy } from "react"

/**
 * Error thrown when a dynamic import fails after all retry attempts.
 *
 * Extends the native `Error` with a `url` field extracted from the browser's
 * error message, which contains the full URL of the chunk that failed to load.
 * This allows {@link ErrorBoundary} to identify chunk load failures across all
 * major browsers via `instanceof ChunkLoadError` rather than brittle message
 * string matching.
 *
 * @extends {Error}
 *
 * @example
 * // Checking for chunk errors in a catch block
 * try {
 *   await import("./Dashboard")
 * } catch (error) {
 *   if (error instanceof ChunkLoadError) {
 *     console.error("Chunk failed to load:", error.url)
 *   }
 * }
 *
 * @example
 * // Narrowing in ErrorBoundary
 * const isChunkLoadError = (error: Error): boolean =>
 *   error instanceof ChunkLoadError ||
 *   error.name === "ChunkLoadError" // fallback for browser-native chunk errors
 */
export class ChunkLoadError extends Error {
  readonly url: string

  constructor(url: string, cause?: unknown) {
    super(`Failed to load chunk: ${url}`)
    this.name = "ChunkLoadError"
    this.url = url
    this.cause = cause
  }
}

/**
 * Attempts a dynamic import, retrying once after a delay if the initial attempt fails.
 *
 * Intended to be used exclusively via {@link lazyWithRetry} — not called directly.
 * If both attempts fail, throws a {@link ChunkLoadError} with the browser's native
 * error message attached as `cause`, preserving the original error for Sentry reporting
 * and debugging.
 *
 * @param importFn - A function that returns a dynamic import promise
 * @param retries - Number of retry attempts remaining (default: 1)
 * @param retryDelay - Milliseconds to wait before retrying (default: 500)
 *
 * @returns The resolved module containing the default export
 *
 * @throws {ChunkLoadError} If the import fails after all retries are exhausted
 *
 * @example
 * // Resolves on first attempt
 * const module = await importWithRetry(() => import("./Dashboard"))
 *
 * @example
 * // Retries once after 500ms, then throws ChunkLoadError
 * const module = await importWithRetry(() => import("./Dashboard"), 1, 500)
 */
const importWithRetry = async <T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  retries = 1,
  retryDelay = 500,
): Promise<{ default: T }> => {
  try {
    return await importFn()
  } catch (error) {
    if (retries <= 0) {
      const url = error instanceof Error ? error.message : String(error)
      throw new ChunkLoadError(url, error)
    }

    await new Promise((resolve) => setTimeout(resolve, retryDelay))
    return importWithRetry(importFn, retries - 1, retryDelay)
  }
}

/**
 * A wrapper around React's `lazy` that automatically retries a failed dynamic import
 * once before throwing a {@link ChunkLoadError}.
 *
 * On the first failure, waits 500ms then retries the import. If the retry also fails,
 * throws a `ChunkLoadError` with the browser's native error message (which includes
 * the chunk URL) attached as `cause`. This error is then caught by `ErrorBoundary`,
 * which attempts a one-time page reload before showing the fallback UI.
 *
 * @param importFn - A function that returns a dynamic import promise, identical to
 * what you would pass to `React.lazy`
 *
 * @returns A lazy-loaded React component with automatic retry behaviour
 *
 * @throws {ChunkLoadError} If the import fails after one retry
 *
 * @example
 * // Basic usage — drop-in replacement for React.lazy
 * const Dashboard = lazyWithRetry(() => import("./Dashboard"))
 *
 * @example
 * // Used with Suspense and ErrorBoundary
 * const Settings = lazyWithRetry(() => import("./Settings"))
 *
 * function App() {
 *   return (
 *     <ErrorBoundary>
 *       <Suspense fallback={<Spinner />}>
 *         <Settings />
 *       </Suspense>
 *     </ErrorBoundary>
 *   )
 * }
 */
export const lazyWithRetry = <T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
): LazyExoticComponent<T> => lazy(() => importWithRetry(importFn))
