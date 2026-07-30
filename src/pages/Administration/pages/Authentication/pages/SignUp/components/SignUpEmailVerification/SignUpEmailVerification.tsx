import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

interface SignUpEmailVerificationProps {
  email: string
}

/**
 * Page displayed after successfully creating a user. It informs the users of the email verification
 * step.
 *
 * @param email Email to which verification has been sent
 */
export default function SignUpEmailVerification({ email }: SignUpEmailVerificationProps) {
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
        {t("SignUp.EmailVerification.title")}
      </Typography>
      <Typography>{t("SignUp.EmailVerification.msg", { email: email })}</Typography>
    </Box>
  )
}
