import ResultListContainer from "../../../../../../components/ResultsList/ResultListContainer.tsx"
import { Alert } from "@mui/material"
import ConstructionIcon from "@mui/icons-material/Construction"
import { useTranslation } from "react-i18next"

export default function FootOSplits() {
  const { t } = useTranslation()

  return (
    <ResultListContainer>
      <Alert icon={<ConstructionIcon />} severity="info">
        {t("ThisFunctionalityNotImplementedMsg")}
      </Alert>
    </ResultListContainer>
  )
}
