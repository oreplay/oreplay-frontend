import { describe, expect, it } from "vitest"
import { IGNORED_ERRORS } from "./ignoredErrors.ts"
import { ChunkLoadError } from "../../services/lazyLoad.ts"

/**
 * Tells whether Sentry would drop an error with this message, matching it the way Sentry does:
 * against the message alone and against `Type: message`.
 *
 * @param type The error's name, such as `TypeError`.
 * @param message The error's message.
 * @returns `true` when any ignored pattern matches.
 */
function isIgnored(type: string, message: string): boolean {
  return Object.values(IGNORED_ERRORS).some(
    (pattern) => pattern.test(message) || pattern.test(`${type}: ${message}`),
  )
}

describe("IGNORED_ERRORS", () => {
  it.each([
    [
      "TypeError",
      "Failed to fetch dynamically imported module: https://www.oreplay.es/assets/en-Cfx1oR29.js",
    ],
    ["TypeError", "error loading dynamically imported module: https://www.oreplay.es/assets/a.js"],
    ["TypeError", "Importing a module script failed."],
    [
      "Error",
      "NotSupportedError: Failed to register a ServiceWorker for scope ('https://www.oreplay.es/') with script ('https://www.oreplay.es/sw.js'): The user denied permission to use Service Worker.",
    ],
    ["TypeError", "Script https://www.oreplay.es/sw.js load failed"],
    ["Error", "Error invoking postMessage: Java object is gone"],
  ])("ignores %s: %s", (type, message) => {
    expect(isIgnored(type, message)).toBe(true)
  })

  it("keeps a chunk load error that a reload did not fix", () => {
    const error = new ChunkLoadError(
      "Failed to fetch dynamically imported module: https://www.oreplay.es/assets/Totals-C2V0d91t.js",
    )

    expect(isIgnored(error.name, error.message)).toBe(false)
  })

  it("keeps errors raised by the app", () => {
    expect(isIgnored("TypeError", "undefined is not an object (evaluating 'r.points_final')")).toBe(
      false,
    )
  })
})
