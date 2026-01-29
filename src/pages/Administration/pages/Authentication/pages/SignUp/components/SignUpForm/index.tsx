import { Trans, useTranslation } from "react-i18next"
import { useForm } from "@tanstack/react-form"
import {
  Box,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Link,
  TextField,
  Typography,
} from "@mui/material"
import Button from "@mui/material/Button"
import { SignUpUser } from "../../../../../../shared/EntityTypes.ts"
import { maxLengthValidator } from "../../../../../../../../shared/Functions.tsx"
import { emailValidator } from "../../../../shared/validatorFunctions.ts"
import PasswordField from "../../../../components/PasswordField"
import { validatePassword } from "../../../../components/PasswordField/shared/passwordValidation.ts"

export interface SignUpFormState extends SignUpUser {
  terms_conditions: boolean
}

const MAX_LENGTH = {
  first_name: 50,
  last_name: 100,
  email: 160,
  password: 64,
}

interface SignUpFormProps {
  onSubmit: (value: SignUpFormState) => void
  isSubmitting?: boolean
}

/**
 * Form containing field for the SignUp page
 * @param onSubmit Function to be called when the user hits the submit button
 * @param isSubmitting State of the mutation associated to the form submission.
 */
export default function SignUpForm({ onSubmit, isSubmitting }: SignUpFormProps) {
  const { t, i18n } = useTranslation()

  const formDefaultValues: SignUpFormState = {
    email: "",
    first_name: "",
    email_me: false,
    last_name: "",
    password: "",
    preferred_language: i18n.language,
    terms_conditions: false,
  }
  const form = useForm({
    defaultValues: formDefaultValues,
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
      <Typography component={"h1"} variant={"h2"}>
        {t("SignUp.SignUp")}
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
          name={"first_name"}
          validators={{
            onChange: ({ value }) => maxLengthValidator(value, MAX_LENGTH.first_name, t),
          }}
        >
          {(field) => (
            <TextField
              required
              fullWidth
              id={"firstName"}
              type={"text"}
              autoComplete={"given-name"}
              label={t("SignUp.FirstName")}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={!!field.state.meta.errors.length}
              helperText={field.state.meta.errors.join(" ")}
            />
          )}
        </form.Field>
        <form.Field
          name={"last_name"}
          validators={{
            onChange: ({ value }) => maxLengthValidator(value, MAX_LENGTH.last_name, t),
          }}
        >
          {(field) => (
            <TextField
              required
              fullWidth
              id={"lastName"}
              type={"text"}
              autoComplete={"family-name"}
              label={t("SignUp.LastName")}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={!!field.state.meta.errors.length}
              helperText={field.state.meta.errors.join(" ")}
            />
          )}
        </form.Field>
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
        <form.Field
          name={"password"}
          validators={{
            onChange: ({ value }) => maxLengthValidator(value, MAX_LENGTH.password, t),
            onBlur: ({ value }) => validatePassword(value, undefined, t),
          }}
        >
          {(field) => <PasswordField field={field} />}
        </form.Field>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginX: "1rem",
          }}
        >
          <form.Field name={"email_me"}>
            {(field) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    onBlur={field.handleBlur}
                    color="primary"
                  />
                }
                label={<Typography variant={"caption"}>{t("SignUp.EmailMe")}</Typography>}
              />
            )}
          </form.Field>
          <form.Field
            name={"terms_conditions"}
            validators={{
              onSubmit: ({ value }) => (value ? undefined : t("SignUp.TermsConditions.notChecked")),
              onChange: ({ value }) => (value ? undefined : t("SignUp.TermsConditions.notChecked")),
            }}
          >
            {(field) => (
              <FormControl error={!!field.state.meta.errors}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      onBlur={field.handleBlur}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant={"caption"}>
                      <Trans i18nKey={"SignUp.TermsConditions.label"}>
                        First
                        <Link target={"_blank"} href={"/legal-notice"}>
                          terms and conditions
                        </Link>
                        last.
                      </Trans>
                    </Typography>
                  }
                />
                {field.state.meta.errors && (
                  <FormHelperText>{field.state.meta.errors[0]}</FormHelperText>
                )}
              </FormControl>
            )}
          </form.Field>
        </Box>
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
              {t("SignUp.SignUp")}
            </Box>
          ) : (
            t("SignUp.SignUp")
          )}
        </Button>
        <Typography sx={{ textAlign: "center", fontSize: "small" }}>
          <Trans i18nKey={"SignUp.AlreadyHaveAccount"}>
            Already have an account?
            <Link href="/signin" variant="body2" sx={{ alignSelf: "center" }}>
              Sign in
            </Link>
          </Trans>
        </Typography>
      </Container>
    </Box>
  )
}
