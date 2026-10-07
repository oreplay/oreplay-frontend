import { useIsMobileDevice } from "../../../../../../shared/useIsMobileDevice.ts"
import { ClassSelectorTriggerProps } from "../../shared/classSelector.ts"
import ClassSelectorTriggerDesktop from "./components/ClassSelectorTriggerDesktop.tsx"
import ClassSelectorTriggerMobile from "./components/ClassSelectorTriggerMobile.tsx"

export default function ClassSelectorTrigger(props: ClassSelectorTriggerProps) {
  const isMobileDevice = useIsMobileDevice()

  return isMobileDevice ? (
    <ClassSelectorTriggerMobile {...props} />
  ) : (
    <ClassSelectorTriggerDesktop {...props} />
  )
}
