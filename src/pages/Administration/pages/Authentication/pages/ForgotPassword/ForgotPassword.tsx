import { Container } from "@mui/material"
import { useState } from "react"
import { useMutation } from "react-query"
import { useNotifications } from "@toolpad/core/useNotifications"
import { AxiosError } from "axios"
import ForgotPasswordForm from "./components/ForgotPasswordForm/ForgotPasswordForm.tsx"
import ForgotPasswordEmailSent from "./components/ForgotPasswordEmailSent/ForgotPasswordEmailSent.tsx"
import { requestPasswordReset } from "../../../../services/UserService.ts"

/**
 * Main ForgotPassword page
 */
export default function ForgotPassword() {
  const notifications = useNotifications()
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const forgotPasswordMutation = useMutation(["request-password-reset"], requestPasswordReset, {
    onError: (err: AxiosError) => {
      console.error(err)
      notifications.show(err.message, {
        severity: "error",
      })
    },
    onSuccess: (_, variables: string) => setSubmittedEmail(variables),
  })

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ height: "100vh", display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      {submittedEmail ? (
        <ForgotPasswordEmailSent email={submittedEmail} />
      ) : (
        <ForgotPasswordForm
          onSubmit={forgotPasswordMutation.mutate}
          isSubmitting={forgotPasswordMutation.isLoading}
        />
      )}
    </Container>
  )
}
