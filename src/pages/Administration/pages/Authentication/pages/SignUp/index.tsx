import { Container } from "@mui/material"
import { useState } from "react"
import SignUpForm from "./components/SignUpForm"
import { signUp } from "../../../../services/UserService.ts"
import { useMutation } from "react-query"
import { useNotifications } from "@toolpad/core/useNotifications"
import SignUpEmailVerification from "./components/SignUpEmailVerification"
import { AxiosError } from "axios"
import { SignUpUser } from "../../../../shared/EntityTypes.ts"

/**
 * Main SignUp page
 */
export default function SignUp() {
  const notifications = useNotifications()
  const [submitted, setSubmitted] = useState<boolean>(false)

  const signUpMutation = useMutation(["create-user"], signUp, {
    onError: (err: AxiosError<SignUpUser>) => {
      console.error(err)
      notifications.show(err.message, {
        severity: "error",
      })
    },
    onSuccess: () => setSubmitted(true),
  })

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ height: "100vh", display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      {submitted ? (
        <SignUpEmailVerification email={signUpMutation.data?.data.email || ""} />
      ) : (
        <SignUpForm onSubmit={signUpMutation.mutate} isSubmitting={signUpMutation.isLoading} />
      )}
    </Container>
  )
}
