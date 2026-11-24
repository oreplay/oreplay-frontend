import { Routes } from "react-router-dom"
import { withSentryReactRouterV7Routing } from "@sentry/react"

/**
 * Drop-in replacement for React Router's `Routes` that names Sentry's page load and navigation
 * transactions after the matched route pattern (`/competitions/:eventId/:stageId`) instead of
 * the raw URL, so performance data groups by page.
 *
 * Nested `Routes` must use it too, so their part of the pattern is added to the name. It only
 * wraps `Routes` when Sentry was initialised first (`src/infrastructure/sentry/instrument.ts`,
 * imported at the top of `main.tsx`); otherwise it is the plain `Routes`.
 */
const SentryRoutes = withSentryReactRouterV7Routing(Routes)

export default SentryRoutes
