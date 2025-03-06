import ScienceIcon from "@mui/icons-material/Science"
import { Alert } from "@mui/material"
import { useTranslation } from "react-i18next"

export default function ExperimentalFeatureAlert() {
  const {t} = useTranslation();
  return <Alert severity="info" icon={<ScienceIcon />} sx={{ marginBottom: "1em" }}>
    {t("ExperimentalFeatureMsg")}
  </Alert>
}