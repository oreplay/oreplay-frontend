import { Alert } from "@mui/material"
import { useTranslation } from "react-i18next"
import { LoginError, loginErrorMessageKey } from "../shared/loginError.ts"

interface LoginErrorAlertProps {
  loginError: LoginError
}

export default function LoginErrorAlert({ loginError }: LoginErrorAlertProps) {
  const { t } = useTranslation()

  return (
    <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
      {t(loginErrorMessageKey(loginError))}
    </Alert>
  )
}
