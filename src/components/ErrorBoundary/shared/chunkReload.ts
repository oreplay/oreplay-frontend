import { ChunkLoadError } from "../../../services/lazyLoad.ts"

const CHUNK_RELOAD_ATTEMPTED_KEY = "chunk_reload_attempted"

/**
 * Forgets that the page was reloaded to recover from a chunk load error, so the next one can
 * reload again.
 */
export function clearChunkReloadAttempt(): void {
  sessionStorage.removeItem(CHUNK_RELOAD_ATTEMPTED_KEY)
}

/**
 * Tells whether the page was already reloaded in this browser session to recover from a chunk
 * load error.
 *
 * @returns `true` when a reload was attempted and not cleared since.
 */
export function hasAttemptedChunkReload(): boolean {
  return sessionStorage.getItem(CHUNK_RELOAD_ATTEMPTED_KEY) === "true"
}

/**
 * Remembers that the page is being reloaded to recover from a chunk load error, so a chunk that
 * still fails after the reload does not reload the page again.
 */
export function markChunkReloadAttempt(): void {
  sessionStorage.setItem(CHUNK_RELOAD_ATTEMPTED_KEY, "true")
}

/**
 * Decides whether an error should be recovered from by reloading the page.
 *
 * A chunk usually fails to load because a deploy replaced it, and a reload fetches the current
 * ones. The reload is attempted only once, so a chunk that keeps failing is shown and reported.
 *
 * @param error The error caught by the boundary.
 * @param reloadAlreadyAttempted Whether the page was already reloaded for a chunk error.
 * @returns `true` for a `ChunkLoadError` when no reload was attempted yet.
 */
export function shouldReloadForChunkError(
  error: unknown,
  reloadAlreadyAttempted: boolean,
): boolean {
  return error instanceof ChunkLoadError && !reloadAlreadyAttempted
}
