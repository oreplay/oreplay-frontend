import "./infrastructure/sentry/instrument.ts"
import React from "react"
import ReactDOM from "react-dom/client"
import "./i18n.ts"
import App from "./App.tsx"
import { QueryClientProvider } from "react-query"
import { queryClient } from "./infrastructure/queryClient.ts"
import { AuthProvider } from "./shared/AuthProvider.tsx"
import { API_DOMAIN } from "./services/ApiConfig.ts"
import { initAxiosClientInstance } from "./infrastructure/orval/AxiosInstance.ts"

// Initialize orval axios instance
initAxiosClientInstance(API_DOMAIN)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
