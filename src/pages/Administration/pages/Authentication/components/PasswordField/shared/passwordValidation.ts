import { TFunction } from "i18next"

export interface PasswordValidatorOptions {
  minLength: number
  minLowercase: number
  minNumber: number
  minSymbol: number
  minUppercase: number
}

/**
 * This constant represents the default values that are used by password validators. These validators
 * target minimum security complexity of the password
 */
export const DEFAULT_PASSWORD_VALIDATOR_OPTIONS: PasswordValidatorOptions = {
  minLength: 8,
  minLowercase: 1,
  minNumber: 1,
  minUppercase: 1,
  minSymbol: 1,
}

/**
 * Validate if a password meets the security requirements to be used in O-Replay
 *
 * If the password is invalid, a translated string is returned. If the password is valid `undefined`
 * is returned
 *
 * @param password Password to be validated
 * @param options Validation options
 * @param t General translation function from i18next
 */
export function validatePassword(
  password: string,
  options: PasswordValidatorOptions = DEFAULT_PASSWORD_VALIDATOR_OPTIONS,
  t: TFunction,
): string | undefined {
  const checks = passwordChecks(password, options, t)

  if (checks.every(({ valid }) => valid)) {
    // No test failed
    return undefined
  } else {
    // At least one check failed
    return t("SignUp.Password.Validation.DoesntMeetCriteria")
  }
}

/**
 * Validate a password and compute which criteria is met and which not from the complexity
 * requirements
 * @param password Password to be validated
 * @param options Options for the validators
 * @param t General namespace translator function from i18next
 */
export function passwordChecks(
  password: string,
  options: PasswordValidatorOptions = DEFAULT_PASSWORD_VALIDATOR_OPTIONS,
  t: TFunction,
): { label: string; valid: boolean }[] {
  return [
    {
      label: t("SignUp.Password.Validation.AtLeastCharacter", { count: options.minLength }),
      valid: password.length >= options.minLength,
    },
    {
      label: t("SignUp.Password.Validation.AtLeastLowercase", { count: options.minLowercase }),
      valid: /[a-z]/.test(password),
    },
    {
      label: t("SignUp.Password.Validation.AtLeastUppercase", { count: options.minUppercase }),
      valid: /[A-Z]/.test(password),
    },
    {
      label: t("SignUp.Password.Validation.AtLeastNumber", { count: options.minNumber }),
      valid: /[0-9]/.test(password),
    },
    {
      label: t("SignUp.Password.Validation.AtLeastSymbol", { count: options.minSymbol }),
      valid: /[!@#$%^&*.,]/.test(password),
    },
  ]
}
