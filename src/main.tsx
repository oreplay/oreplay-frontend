import React from "react"
import ReactDOM from "react-dom/client"
import "./i18n.ts"
import App from "./App.tsx"
import { QueryClient, QueryClientProvider } from "react-query"
import { AuthProvider } from "./shared/AuthProvider.tsx"

// In-it sentry data collection
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "https://5300c60f5cd627ee264a29ccfc3dba93@o4509652194099200.ingest.de.sentry.io/4509652204716112",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
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
