import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

interface ForgotPasswordEmailSentProps {
  email: string
}

/**
 * Page displayed after successfully requesting a password reset. It informs the user
 * that instructions have been sent to their inbox.
 *
 * @param email Email to which the reset instructions were sent
 */
export default function ForgotPasswordEmailSent({ email }: ForgotPasswordEmailSentProps) {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: "10px",
      }}
    >
      <Typography component={"h1"} variant={"h4"}>
        {t("ForgotPassword.EmailSent.title")}
      </Typography>
      <Typography>{t("ForgotPassword.EmailSent.msg", { email: email })}</Typography>
    </Box>
  )
}
