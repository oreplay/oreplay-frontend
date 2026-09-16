import { getSignInUrl, storeLoginRedirectPath } from "../../../services/AuthenticationService.ts"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import GeneralSuspenseFallback from "../../../../../components/GeneralSuspenseFallback.tsx"
import { REDIRECT_PARAM } from "../shared/signInRedirect.ts"

export default function InItSignIn() {
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get(REDIRECT_PARAM)

  useEffect(() => {
    storeLoginRedirectPath(redirectPath)
    void getSignInUrl().then((url: string) => {
      window.location.replace(url)
    })
  }, [redirectPath])

  return <GeneralSuspenseFallback />
}
