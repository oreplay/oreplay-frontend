import { Alert, AlertTitle, Box, Link } from "@mui/material"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function WrongResultsFileUploadedMsg() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Box sx={{ marginBottom: "2em" }}>
      <Alert severity="warning">
        <AlertTitle>{t("ResultsStage.WrongFileUploaded.Title")}</AlertTitle>
        <Trans i18nKey="ResultsStage.WrongFileUploaded.Msg">
          First part{" "}
          <Link
            onClick={() => {
              void navigate("/organizers")
            }}
          >
            organizers
          </Link>{" "}
          Second part
        </Trans>
      </Alert>
    </Box>
  )
}
