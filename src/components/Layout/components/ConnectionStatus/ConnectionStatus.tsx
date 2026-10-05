import ConnectionStatusBar from "./components/ConnectionStatusBar.tsx"
import { useConnectionBar } from "./shared/useConnectionBar.ts"
import { useNoConnectionNotification } from "./shared/useNoConnectionNotification.ts"
import { useOnlineStatus } from "./shared/useOnlineStatus.ts"

export default function ConnectionStatus() {
  const isOnline = useOnlineStatus()
  const bar = useConnectionBar(isOnline)
  useNoConnectionNotification(isOnline)

  return <ConnectionStatusBar bar={bar} />
}
