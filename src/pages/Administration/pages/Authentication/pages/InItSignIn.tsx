import {
  getSignInUrl,
  storeLoginError,
  storeLoginRedirectPath,
} from "../../../services/AuthenticationService.ts"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import GeneralSuspenseFallback from "../../../../../components/GeneralSuspenseFallback.tsx"
import { REDIRECT_PARAM } from "../shared/signInRedirect.ts"
import { LOGIN_ERROR_PARAM } from "../shared/loginError.ts"

export default function InItSignIn() {
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get(REDIRECT_PARAM)
  const loginError = searchParams.get(LOGIN_ERROR_PARAM)

  useEffect(() => {
    storeLoginRedirectPath(redirectPath)
    storeLoginError(loginError)
    void getSignInUrl().then((url: string) => {
      window.location.replace(url)
    })
  }, [redirectPath, loginError])

  return <GeneralSuspenseFallback />
}
