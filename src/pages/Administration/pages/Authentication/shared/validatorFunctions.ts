import { TFunction } from "i18next"

export function emailValidator(value: string, t: TFunction): string | undefined {
  if (!value) return undefined // let "required" be handled elsewhere
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  return emailRegex.test(value) ? undefined : t("SignUp.Email.Validation.EnterValidEmailAddress")
}
