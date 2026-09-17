import { DateTime, Duration } from "luxon"

const CREDENTIAL_FIELDS = ["username", "password"] as const
const LOGIN_CHALLENGE_TTL = Duration.fromObject({ minutes: 2 })
const NETWORK_SAFETY_MARGIN = Duration.fromObject({ seconds: 20 })
const LOGIN_CHALLENGE_USABLE_DURATION = LOGIN_CHALLENGE_TTL.minus(NETWORK_SAFETY_MARGIN)

function areCredentialsEmpty(data: FormData): boolean {
  return CREDENTIAL_FIELDS.every((field) => !data.get(field))
}

export function isLoginChallengeStale(requestedAt: DateTime, now: DateTime): boolean {
  if (!requestedAt.isValid) {
    return true
  }
  return now.diff(requestedAt) >= LOGIN_CHALLENGE_USABLE_DURATION
}

export function isUntouchedLoginChallengeStale(
  data: FormData,
  requestedAt: DateTime,
  now: DateTime,
): boolean {
  return areCredentialsEmpty(data) && isLoginChallengeStale(requestedAt, now)
}
