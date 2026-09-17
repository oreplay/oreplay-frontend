export const INVALID_CREDENTIALS = "invalidCredentials"
export const LOGIN_CHALLENGE_EXPIRED = "loginChallengeExpired"

export const LOGIN_ERRORS = [
  { key: INVALID_CREDENTIALS, status: "401", messageKey: "Sign in.InvalidCredentials" },
  { key: LOGIN_CHALLENGE_EXPIRED, status: null, messageKey: "Sign in.LoginChallengeExpired" },
] as const
export type LoginError = (typeof LOGIN_ERRORS)[number]["key"]

export const LOGIN_ERROR_PARAM = "loginError"
export const LOGIN_ERROR_STATUS_PARAM = "error_status"

export function loginErrorFromStatus(status: string | null): LoginError | undefined {
  if (!status) {
    return undefined
  }
  return LOGIN_ERRORS.find((error) => error.status === status)?.key
}

export function loginErrorMessageKey(error: LoginError): string {
  return LOGIN_ERRORS.find(({ key }) => key === error)?.messageKey ?? ""
}

export function parseLoginError(value: string | null): LoginError | undefined {
  return LOGIN_ERRORS.find(({ key }) => key === value)?.key
}
