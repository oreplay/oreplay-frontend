import { SyntheticEvent } from "react"
import { useNavigate } from "react-router-dom"
import { DateTime } from "luxon"
import {
  getStoredLoginRedirectPath,
  getStoredLoginRequestedAt,
} from "../../../services/AuthenticationService.ts"
import { LOGIN_CHALLENGE_EXPIRED } from "./loginError.ts"
import { isLoginChallengeStale, isUntouchedLoginChallengeStale } from "./loginChallenge.ts"
import { retrySignInPath } from "./signInRedirect.ts"

export function useLoginChallengeGuard() {
  const navigate = useNavigate()

  const restartWhen = (shouldRestart: boolean): boolean => {
    if (shouldRestart) {
      void navigate(retrySignInPath(getStoredLoginRedirectPath(), LOGIN_CHALLENGE_EXPIRED))
    }
    return shouldRestart
  }

  const restartIfLoginChallengeIsStale = (): boolean =>
    restartWhen(isLoginChallengeStale(getStoredLoginRequestedAt(), DateTime.now()))

  const restartIfUntouchedAndStale = (event: SyntheticEvent<HTMLFormElement>): void => {
    const data = new FormData(event.currentTarget)
    const isStale = isUntouchedLoginChallengeStale(
      data,
      getStoredLoginRequestedAt(),
      DateTime.now(),
    )
    if (restartWhen(isStale)) {
      event.preventDefault()
    }
  }

  return { restartIfStale: restartIfLoginChallengeIsStale, restartIfUntouchedAndStale }
}
