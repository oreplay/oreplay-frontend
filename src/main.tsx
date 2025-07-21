import React from "react"
import ReactDOM from "react-dom/client"
import "./i18n.ts"
import App from "./App.tsx"
import { QueryClient, QueryClientProvider } from "react-query"
import { AuthProvider } from "./shared/AuthProvider.tsx"

// In-it sentry data collection
const sentryDSN = import.meta.env.VITE_SENTRY_DSN
import * as Sentry from "@sentry/react"
import { API_BASE_URL } from "./services/ApiConfig.ts"

Sentry.init({
  dsn: sentryDSN,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: import.meta.env.VITE_SENTRY_TRACING_RATE,
  tracePropagationTargets: [API_BASE_URL],
})

// Make queries though TanStack Query
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
