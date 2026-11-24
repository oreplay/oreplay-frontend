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
 * Forgets the last reload made to recover from a chunk load error, so the next one can reload
 * right away.
 */
export function clearChunkReloadAttempt(): void {
  sessionStorage.removeItem(CHUNK_RELOAD_ATTEMPTED_AT_KEY)
}

/**
 * Returns when the page was last reloaded in this browser session to recover from a chunk load
 * error.
 *
 * @returns The time of the last reload, or `null` when there was none or the stored value is
 * not a valid time.
 */
export function lastChunkReloadAttempt(): DateTime | null {
  const storedMillis = Number(sessionStorage.getItem(CHUNK_RELOAD_ATTEMPTED_AT_KEY) ?? Number.NaN)
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
 */
export function markChunkReloadAttempt(now: DateTime = DateTime.now()): void {
  sessionStorage.setItem(CHUNK_RELOAD_ATTEMPTED_AT_KEY, String(now.toMillis()))
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
