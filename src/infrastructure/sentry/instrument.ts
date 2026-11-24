import { useEffect } from "react"
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom"
import * as Sentry from "@sentry/react"
import { API_BASE_URL } from "../../services/ApiConfig.ts"
import { IGNORED_ERRORS } from "./ignoredErrors.ts"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.reactRouterV7BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACING_RATE),
  tracePropagationTargets: [API_BASE_URL],
  ignoreErrors: Object.values(IGNORED_ERRORS),
})
