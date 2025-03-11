import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import FootOSplitsTable from "./components/FootOSplitsTable/FootOSplitsTable.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"
import { useState } from "react"
import { FormControlLabel, Switch } from "@mui/material"
import ExperimentalFeatureAlert from "../../../../../../../../components/ExperimentalFeatureAlert.tsx"

export default function FootOSplits(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const [onlyRadios, setOnlyRadios] = useState<boolean>(false)
  const [showDiffs, setShowDiffs] = useState<boolean>(false)

  if (!props.activeClass) {
    return <ChooseClassMsg />
  } else if (props.runnersQuery.isFetching) {
    return <GeneralSuspenseFallback />
  } else if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  } else {
    return (
      <>
        <ExperimentalFeatureAlert />
        <FormControlLabel
          control={<Switch checked={showDiffs} onChange={() => setShowDiffs((prev) => !prev)} />}
          label="Diff"
          disabled={onlyRadios}
        />
        {props.activeClass.splits.length > 0 ? (
          <FormControlLabel
            control={
              <Switch checked={onlyRadios} onChange={() => setOnlyRadios((prev) => !prev)} />
            }
            label="Radios"
          />
        ) : (
          <></>
        )}
        <FootOSplitsTable
          onlyRadios={onlyRadios}
          radiosList={props.activeClass.splits}
          showDiffs={showDiffs}
          key={"FootOSplitsTable"}
          runners={props.runnersQuery.data ? props.runnersQuery.data : []}
        />
      </>
    )
  }
}
