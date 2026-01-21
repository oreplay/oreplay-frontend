import { Box, Collapse, IconButton, InputAdornment, TextField } from "@mui/material"
import PasswordChecklist from "./components/PasswordChecklist"
import { useTranslation } from "react-i18next"
import { useMemo, useState } from "react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import {
  DEFAULT_PASSWORD_VALIDATOR_OPTIONS,
  passwordChecks,
  PasswordValidatorOptions,
} from "./shared/passwordValidation.ts"

interface PasswordFieldApi {
  state: {
    value: string | undefined
    meta: {
      errors: Array<string | undefined>
    }
  }
  handleChange: (value: string) => void
  handleBlur: (event?: unknown) => void
}

interface PasswordFieldProps {
  field: PasswordFieldApi
  options?: PasswordValidatorOptions
}

export default function PasswordField({
  field,
  options = DEFAULT_PASSWORD_VALIDATOR_OPTIONS,
}: PasswordFieldProps) {
  const { t } = useTranslation()

  // Component states
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // Validate password
  const password = field.state.value || ""
  const checks = useMemo(() => passwordChecks(password, options, t), [options, password, t])

  // Component field
  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        required
        fullWidth
        id={"new-password"}
        type={showPassword ? "text" : "password"}
        autoComplete={"new-password"}
        label={t("Password")}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => {
          field.handleBlur()
        }}
        onFocus={() => setIsFocused(true)}
        error={!!field.state.meta.errors.length}
        helperText={field.state.meta.errors.join(" ")}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  aria-label={showPassword ? t("Hide password") : t("Show password")}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Collapse in={isFocused}>
        <PasswordChecklist checks={checks} />
      </Collapse>
    </Box>
  )
}
