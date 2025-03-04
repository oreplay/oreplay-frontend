import { getSignInUrl } from "../../../services/AuthenticationService.ts"
import { useEffect } from "react"
import GeneralSuspenseFallback from "../../../../../components/GeneralSuspenseFallback.tsx"

export default function InItSignIn() {
  useEffect(() => {
    void getSignInUrl().then((url: string) => {
      window.location.replace(url)
    })
  }, [])

  return <GeneralSuspenseFallback />
}
