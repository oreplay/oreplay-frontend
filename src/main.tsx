import React from "react"
import ReactDOM from "react-dom/client"
import "./i18n.ts"
import App from "./App.tsx"
import { QueryClient, QueryClientProvider } from "react-query"
import { AuthProvider } from "./shared/AuthProvider.tsx"

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
