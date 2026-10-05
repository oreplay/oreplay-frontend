export const BACK_ONLINE_DISPLAY_MS = 3000

export const CONNECTION_BAR_KINDS = ["backOnline", "offline"] as const
export type ConnectionBarKind = (typeof CONNECTION_BAR_KINDS)[number]

export interface ConnectionBarState {
  kind: ConnectionBarKind
  isVisible: boolean
}

interface ConnectionBarAppearance {
  backgroundColor: string
  labelKey: string
}

export const CONNECTION_BAR_APPEARANCE: Record<ConnectionBarKind, ConnectionBarAppearance> = {
  backOnline: { backgroundColor: "success.main", labelKey: "common:backOnline" },
  offline: { backgroundColor: "grey.900", labelKey: "common:noConnection" },
}

const OFFLINE_BAR: ConnectionBarState = { kind: "offline", isVisible: true }
const BACK_ONLINE_BAR: ConnectionBarState = { kind: "backOnline", isVisible: true }
const HIDDEN_BAR: ConnectionBarState = { kind: "backOnline", isVisible: false }

export function connectionBarOnConnectivityChange(
  current: ConnectionBarState,
  isOnline: boolean,
): ConnectionBarState {
  if (!isOnline) return current.kind === "offline" ? current : OFFLINE_BAR
  return current.kind === "offline" ? BACK_ONLINE_BAR : current
}

export function hideConnectionBar(current: ConnectionBarState): ConnectionBarState {
  return current.isVisible ? { ...current, isVisible: false } : current
}

export function initialConnectionBar(isOnline: boolean): ConnectionBarState {
  return isOnline ? HIDDEN_BAR : OFFLINE_BAR
}

export function isShowingBackOnline(state: ConnectionBarState): boolean {
  return state.kind === "backOnline" && state.isVisible
}
