import { STAGE_TYPE_DATABASE_ID } from "../shared/constants.ts"
import { lazy } from "react"
const FootO = lazy(() => import("../pages/FootO/FootO.tsx"))
const Relay = lazy(() => import("../pages/Relay/Relay.tsx"))
const Rogaine = lazy(() => import("../pages/Rogaine/Rogaine.tsx"))

type StageTypeSelectorProps = {
  stageType: string
}

export default function StageTypeSelector(props: StageTypeSelectorProps) {
  switch (props.stageType) {
    case STAGE_TYPE_DATABASE_ID.FootO:
      return <FootO />
    case STAGE_TYPE_DATABASE_ID.Rogaine:
      return <Rogaine />
    case STAGE_TYPE_DATABASE_ID.Relay:
      return <Relay />
    case STAGE_TYPE_DATABASE_ID.Totals:
      return <FootO />
    default:
      throw new Error("Unknown stage type")
  }
}
