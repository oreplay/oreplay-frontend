import { useTranslation } from "react-i18next"
import { useForm } from "@tanstack/react-form"
import { Box, CircularProgress, Container, TextField, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import { maxLengthValidator } from "../../../../../../../../shared/Functions.tsx"
import { emailValidator } from "../../../../shared/validatorFunctions.ts"

export interface ForgotPasswordFormState {
  email: string
}

const MAX_LENGTH = {
  email: 160,
}

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void // <-- must be string, not ForgotPasswordFormState
  isSubmitting?: boolean
}

export default function ForgotPasswordForm({ onSubmit, isSubmitting }: ForgotPasswordFormProps) {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: { email: "" } as ForgotPasswordFormState,
    onSubmit: ({ value }) => onSubmit(value.email), // <-- pass value.email, not value
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
      <Typography component={"h1"} variant={"h2"}>
        {t("ForgotPassword.Title")}
      </Typography>
      <Typography sx={{ textAlign: "center", marginTop: 2, maxWidth: "450px" }}>
        {t("ForgotPassword.Instructions")}
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
        <form.Field
          name={"email"}
          validators={{
            onChange: ({ value }) => maxLengthValidator(value, MAX_LENGTH.email, t),
            onBlur: ({ value }) => emailValidator(value, t),
          }}
        >
          {(field) => (
            <TextField
              required
              fullWidth
              id={"email"}
              type={"email"}
              autoComplete={"email"}
              label={t("EmailAddress")}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={!!field.state.meta.errors.length}
              helperText={field.state.meta.errors.join(" ")}
            />
          )}
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
              {t("ForgotPassword.Submit")}
            </Box>
          ) : (
            t("ForgotPassword.Submit")
          )}
        </Button>
      </Container>
    </Box>
  )
}
