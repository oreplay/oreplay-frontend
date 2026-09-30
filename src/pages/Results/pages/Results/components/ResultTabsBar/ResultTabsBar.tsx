import { useIsMobileDevice } from "../../shared/useIsMobileDevice.ts"
import { ResultTabsBarProps } from "../../shared/resultTabs.ts"
import ResultTabsBarMobile from "./components/ResultTabsBarMobile.tsx"
import ResultTabsBarDesktop from "./components/ResultTabsBarDesktop/ResultTabsBarDesktop.tsx"

export default function ResultTabsBar(props: ResultTabsBarProps) {
  const isMobileDevice = useIsMobileDevice()

  return isMobileDevice ? <ResultTabsBarMobile {...props} /> : <ResultTabsBarDesktop {...props} />
}
