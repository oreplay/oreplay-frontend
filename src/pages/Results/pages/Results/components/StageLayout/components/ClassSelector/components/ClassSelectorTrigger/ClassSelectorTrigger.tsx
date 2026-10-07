import { useIsMobileDevice } from "../../../../../../shared/useIsMobileDevice.ts"
import { ClassSelectorTriggerProps } from "../../shared/classSelector.ts"
import ClassSelectorTriggerFloatingButton from "./components/ClassSelectorTriggerFloatingButton.tsx"
import ClassSelectorTriggerInput from "./components/ClassSelectorTriggerInput.tsx"

export default function ClassSelectorTrigger(props: ClassSelectorTriggerProps) {
  const isMobileDevice = useIsMobileDevice()

  return (
    <>
      <ClassSelectorTriggerInput {...props} />
      {isMobileDevice ? <ClassSelectorTriggerFloatingButton {...props} /> : null}
    </>
  )
}
