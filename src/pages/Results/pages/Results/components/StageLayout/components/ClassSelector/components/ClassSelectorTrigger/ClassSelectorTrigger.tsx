import { ClassSelectorTriggerProps } from "../../shared/classSelector.ts"
import ClassSelectorTriggerDesktop from "./components/ClassSelectorTriggerDesktop.tsx"

export default function ClassSelectorTrigger(props: ClassSelectorTriggerProps) {
  return <ClassSelectorTriggerDesktop {...props} />
}
