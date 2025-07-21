// <reference types="vite/client" />

// Declare types for env variables
interface ImportMetaEnv {
  readonly VITE_API_DOMAIN: string
  readonly VITE_VERSION_NUMBER: string
  readonly VITE_VERSION_TYPE: string
  readonly VITE_DESKTOP_CLIENT_VERSION_FALLBACK: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_SENTRY_TRACING_RATE: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Handle svg files
declare module "*.svg" {
  const content: string
  export default content
}
