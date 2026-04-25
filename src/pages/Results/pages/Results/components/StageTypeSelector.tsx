import { STAGE_TYPE_DATABASE_ID } from "../shared/constants.ts"
import { lazyWithRetry } from "../../../../../services/lazyLoad.ts"
const Ranking = lazyWithRetry(() => import("../pages/Ranking"))
const OneManRelay = lazyWithRetry(() => import("../pages/OneManRelay"))
const FootO = lazyWithRetry(() => import("../pages/FootO/FootO.tsx"))
const Relay = lazyWithRetry(() => import("../pages/Relay/Relay.tsx"))
const Rogaine = lazyWithRetry(() => import("../pages/Rogaine/Rogaine.tsx"))
const Totals = lazyWithRetry(() => import("../pages/Totals/Totals.tsx"))

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
