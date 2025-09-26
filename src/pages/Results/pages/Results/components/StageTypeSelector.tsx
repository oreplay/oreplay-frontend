import { STAGE_TYPE_DATABASE_ID } from "../shared/constants.ts"
import { lazy } from "react"
const Ranking = lazy(() => import("../pages/Ranking"))
const OneManRelay = lazy(() => import("../pages/OneManRelay"))
const FootO = lazy(() => import("../pages/FootO/FootO.tsx"))
const Relay = lazy(() => import("../pages/Relay/Relay.tsx"))
const Rogaine = lazy(() => import("../pages/Rogaine/Rogaine.tsx"))
const Totals = lazy(() => import("../pages/Totals/Totals.tsx"))

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
      return <Totals />
    case STAGE_TYPE_DATABASE_ID.Ranking:
      return <Ranking />
    case STAGE_TYPE_DATABASE_ID.OneManRelay:
      return <OneManRelay />
    default:
      throw new Error("Unknown stage type")
  }
}
