import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers"

/**
 * Exposes jest-dom's matchers (`toBeInTheDocument`, `toHaveAttribute`, …) on vitest's `expect`.
 * Vitest 5 no longer bridges the global `jest.Matchers` namespace that jest-dom's root typings
 * augment, and jest-dom's own `vitest` entry still targets the old single-parameter `Assertion`, so
 * the matchers are merged into vitest's documented `Matchers` extension point instead.
 */
declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown>
    extends TestingLibraryMatchers<unknown, R> {}
}
