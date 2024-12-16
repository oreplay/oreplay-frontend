
import ResultListContainer from "../../../../components/ResultsList/ResultListContainer.tsx";
import {Alert} from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import {useTranslation} from "react-i18next";

export default function FootOSplits() {
  const {t} = useTranslation();

  return (
    <ResultListContainer>
      <Alert icon={<ScienceIcon />} severity="info">{t('ThisFunctionalityNotImplementedMsg')}</Alert>
    </ResultListContainer>
  )
}