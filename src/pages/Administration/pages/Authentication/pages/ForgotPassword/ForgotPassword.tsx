import { Container } from "@mui/material"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useNotifications } from "@toolpad/core/useNotifications"
import ForgotPasswordForm from "./components/ForgotPasswordForm/ForgotPasswordForm.tsx"
import {
  usePatchResetPassword,
  usePostListResetPassword,
} from "../../../../../../infrastructure/repositories/reset-password/reset-password.ts"
import ForgotPasswordResetForm, {
  ForgotPasswordResetFormState,
} from "./components/ForgotPasswordResetForm/ForgotPasswordResetForm.tsx"

/**
 * Main ForgotPassword page
 */
export default function ForgotPassword() {
  const notifications = useNotifications()
  const navigate = useNavigate()
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const requestResetMutation = usePostListResetPassword({
    mutation: {
      onError: (err) => {
        console.error(err)
        notifications.show((err as Error).message, {
          severity: "error",
        })
      },
      onSuccess: (_data, variables) => setSubmittedEmail(variables.data.email ?? null),
    },
  })

  const handleRequestSubmit = useCallback(
    (email: string) => {
      requestResetMutation.mutate({ data: { email } })
    },
    [requestResetMutation],
  )

  const resetPasswordMutation = usePatchResetPassword({
    mutation: {
      onError: (err) => {
        console.error(err)
        notifications.show((err as Error).message, {
          severity: "error",
        })
      },
      onSuccess: () => navigate("/signin"),
    },
  })

  const handleResetSubmit = useCallback(
    (value: ForgotPasswordResetFormState) => {
      if (!submittedEmail) {
        return
      }

      resetPasswordMutation.mutate({
        resetPasswordID: Number(value.code),
        data: { password: value.password, email: submittedEmail },
      })
    },
    [resetPasswordMutation, submittedEmail],
  )

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ height: "100vh", display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      {submittedEmail ? (
        <ForgotPasswordResetForm
          email={submittedEmail}
          onSubmit={handleResetSubmit}
          isSubmitting={resetPasswordMutation.isLoading}
          errorMessage={
            resetPasswordMutation.error ? (resetPasswordMutation.error as Error).message : null
          }
        />
      ) : (
        <ForgotPasswordForm
          onSubmit={handleRequestSubmit}
          isSubmitting={requestResetMutation.isLoading}
        />
      )}
    </Container>
  )
}
