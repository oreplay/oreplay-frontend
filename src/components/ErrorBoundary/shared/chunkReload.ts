import { DateTime, Duration } from "luxon"
import { ChunkLoadError } from "../../../services/lazyLoad.ts"

const CHUNK_RELOAD_ATTEMPTED_AT_KEY = "chunk_reload_attempted_at"

/**
 * How long after a reload a chunk load error is taken to mean the reload did not help.
 *
 * A chunk that still fails after the reload does so while the page loads, well within this
 * window, and is then shown and reported instead of reloading again. A chunk error after the
 * window comes from a later deploy and gets its own reload.
 */
export const CHUNK_RELOAD_COOLDOWN = Duration.fromObject({ minutes: 1 })

/**
 * Runs an action on `sessionStorage`, falling back to a value when storage is unavailable.
 *
 * Browsers throw a `SecurityError` on any access to `sessionStorage` when site data is blocked,
 * and an error boundary must never throw while handling another error.
 *
 * @param action The storage access to run.
 * @param fallback The value returned when the access throws.
 * @returns The action's result, or `fallback` when storage is unavailable.
 */
function withSessionStorage<T>(action: (storage: Storage) => T, fallback: T): T {
  try {
    return action(sessionStorage)
  } catch {
    return fallback
  }
}

/**
 * Forgets the last reload made to recover from a chunk load error, so the next one can reload
 * right away. Does nothing when storage is unavailable.
 */
export function clearChunkReloadAttempt(): void {
  withSessionStorage((storage) => storage.removeItem(CHUNK_RELOAD_ATTEMPTED_AT_KEY), undefined)
}

/**
 * Returns when the page was last reloaded in this browser session to recover from a chunk load
 * error.
 *
 * @returns The time of the last reload, or `null` when there was none, the stored value is not
 * a valid time, or storage is unavailable.
 */
export function lastChunkReloadAttempt(): DateTime | null {
  const storedValue = withSessionStorage(
    (storage) => storage.getItem(CHUNK_RELOAD_ATTEMPTED_AT_KEY),
    null,
  )
  const storedMillis = Number(storedValue ?? Number.NaN)
  if (!Number.isFinite(storedMillis)) {
    return null
  }

  return DateTime.fromMillis(storedMillis)
}

/**
 * Remembers that the page is being reloaded to recover from a chunk load error, so a chunk that
 * still fails after the reload does not reload the page again.
 *
 * @param now The time of the reload; defaults to the current time.
 * @returns `true` when the time was stored. `false` when storage is unavailable: the reload
 * could then not be detected afterwards, so the caller must not reload, or a chunk that keeps
 * failing would reload the page forever.
 */
export function markChunkReloadAttempt(now: DateTime = DateTime.now()): boolean {
  return withSessionStorage((storage) => {
    storage.setItem(CHUNK_RELOAD_ATTEMPTED_AT_KEY, String(now.toMillis()))
    return true
  }, false)
}

/**
 * Decides whether an error should be recovered from by reloading the page.
 *
 * A chunk usually fails to load because a deploy replaced it, and a reload fetches the current
 * ones. A chunk error within {@link CHUNK_RELOAD_COOLDOWN} of the last reload means the reload
 * did not help, so the page is not reloaded again and the error is shown and reported.
 *
 * @param error The error caught by the boundary.
 * @param lastAttempt When the page was last reloaded for a chunk error, or `null` if never.
 * @param now The current time.
 * @returns `true` for a `ChunkLoadError` when no reload happened within the cooldown.
 */
export function shouldReloadForChunkError(
  error: unknown,
  lastAttempt: DateTime | null,
  now: DateTime,
): boolean {
  if (!(error instanceof ChunkLoadError)) {
    return false
  }

  return lastAttempt === null || now.diff(lastAttempt) >= CHUNK_RELOAD_COOLDOWN
}
