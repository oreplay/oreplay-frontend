import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import { useTranslation } from "react-i18next"
import ResultListContainer from "../../../../../../components/ResultsList/ResultListContainer.tsx"
import { Alert } from "@mui/material"
import ConstructionIcon from "@mui/icons-material/Construction"

export default function RelayLegs(
  // @ts-expect-error TS6133: variable is declared but never used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const { t } = useTranslation()
  return (
    <ResultListContainer>
      <Alert icon={<ConstructionIcon />} severity="info">
        {t("ThisFunctionalityNotImplementedMsg")}
      </Alert>
    </ResultListContainer>
  )
}
