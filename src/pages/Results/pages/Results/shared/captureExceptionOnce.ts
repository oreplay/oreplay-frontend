import { captureException, withScope } from "@sentry/react"

const reportedErrorKeys = new Set<string>()

/**
 * Returns the message of a thrown value, so errors can be told apart without their stack.
 *
 * @param error The thrown value, which may not be an `Error`.
 * @returns The error's message, or the value converted to a string.
 */
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

/**
 * Reports an error to Sentry only the first time it happens in this page load.
 *
 * Meant for code that runs many times per render, such as sort comparators, where reporting
 * every occurrence would send one event per comparison. Two errors count as the same when they
 * come from the same origin with the same message.
 *
 * @param error The thrown value to report.
 * @param origin Name of the function that caught the error, also sent as the `origin` extra.
 * @param extras Additional data attached to the event. Keep it to identifiers, never personal
 * data.
 */
export function captureExceptionOnce(
  error: unknown,
  origin: string,
  extras: Record<string, unknown> = {},
): void {
  const key = `${origin}: ${errorMessage(error)}`
  if (reportedErrorKeys.has(key)) {
    return
  }
  reportedErrorKeys.add(key)

  withScope((scope) => {
    scope.setExtras({ ...extras, origin })
    captureException(error)
  })
}
