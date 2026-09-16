import { DASHBOARD_PATH } from "../../../../../shared/routes.ts"

export const REDIRECT_PARAM = "redirect"

const SIGN_IN_PATH = "/signin"

interface AppLocation {
  pathname: string
  search: string
}

function isInAppPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\")
}

function isSignInPath(path: string): boolean {
  return (
    path === SIGN_IN_PATH ||
    path.startsWith(`${SIGN_IN_PATH}/`) ||
    path.startsWith(`${SIGN_IN_PATH}?`)
  )
}

export function resolveRedirectPath(path: string | null): string {
  const isSafe = !!path && isInAppPath(path) && !isSignInPath(path)
  return isSafe ? path : DASHBOARD_PATH
}

export function signInPath(location: AppLocation): string {
  const params = new URLSearchParams({ [REDIRECT_PARAM]: location.pathname + location.search })
  return `${SIGN_IN_PATH}?${params.toString()}`
}
