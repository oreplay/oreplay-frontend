import { useTranslation } from "react-i18next"
import { useForm } from "@tanstack/react-form"
import { Alert, Box, CircularProgress, Container, TextField, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import { maxLengthValidator } from "../../../../../../../../shared/Functions.tsx"
import PasswordField from "../../../../components/PasswordField/PasswordField.tsx"
import { validatePassword } from "../../../../components/PasswordField/shared/passwordValidation.ts"

export interface ForgotPasswordResetFormState {
  code: string
  password: string
}

const MAX_LENGTH = {
  code: 6,
  password: 64,
}

const CODE_PATTERN = /^\d{6}$/

interface ForgotPasswordResetFormProps {
  email: string
  onSubmit: (value: ForgotPasswordResetFormState) => void
  isSubmitting?: boolean
  errorMessage?: string | null
}

/**
 * Form containing the reset code and new password fields, shown after the user
 * requests a password reset.
 * @param email Email the reset code was sent to, shown for context
 * @param onSubmit Function to be called when the user hits the submit button
 * @param isSubmitting State of the mutation associated to the form submission.
 * @param errorMessage Error message from a failed reset attempt, if any.
 */
export default function ForgotPasswordResetForm({
  email,
  onSubmit,
  isSubmitting,
  errorMessage,
}: ForgotPasswordResetFormProps) {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: { code: "", password: "" } as ForgotPasswordResetFormState,
    onSubmit: ({ value }) => onSubmit(value),
  })

  return (
    <Box
      sx={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Typography component={"h1"} variant={"h4"}>
        {t("ForgotPassword.EmailSent.title")}
      </Typography>
      <Typography sx={{ textAlign: "center", marginTop: 1, maxWidth: "450px" }}>
        {t("ForgotPassword.EmailSent.msg", { email })}
      </Typography>
      <Container
        component={"form"}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 2,
          maxWidth: "450px",
        }}
      >
        {errorMessage && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        )}
        <form.Field
          name={"code"}
          validators={{
            onChange: ({ value }) =>
              maxLengthValidator(value, MAX_LENGTH.code, t) ||
              (value && !CODE_PATTERN.test(value)
                ? t("ForgotPassword.Reset.InvalidCode")
                : undefined),
          }}
        >
          {(field) => (
            <TextField
              required
              fullWidth
              id={"code"}
              type={"text"}
              inputMode={"numeric"}
              autoComplete={"one-time-code"}
              label={t("ForgotPassword.Reset.Code")}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={!!field.state.meta.errors.length}
              helperText={field.state.meta.errors.join(" ")}
              slotProps={{ htmlInput: { maxLength: MAX_LENGTH.code } }}
            />
          )}
        </form.Field>
        <form.Field
          name={"password"}
          validators={{
            onChange: ({ value }) => maxLengthValidator(value, MAX_LENGTH.password, t),
            onBlur: ({ value }) => validatePassword(value, undefined, t),
          }}
        >
          {(field) => <PasswordField field={field} />}
        </form.Field>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting} // prevent double submit
          sx={{ position: "relative" }}
        >
          {isSubmitting ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              {t("ForgotPassword.Reset.Submit")}
            </Box>
          ) : (
            t("ForgotPassword.Reset.Submit")
          )}
        </Button>
      </Container>
    </Box>
  )
}
