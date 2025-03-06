import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import FootOSplitsTable from "./components/FootOSplitsTable/FootOSplitsTable.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"

export default function FootOSplits(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  if (!props.activeClass) {
    return <ChooseClassMsg />
  } else if (props.runnersQuery.isFetching) {
    return <GeneralSuspenseFallback />
  } else if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  } else {
    return <FootOSplitsTable runners={props.runnersQuery.data ? props.runnersQuery.data : []} />
  }
}
