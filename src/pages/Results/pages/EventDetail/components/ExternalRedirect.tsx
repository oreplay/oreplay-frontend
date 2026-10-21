import { useEffect } from "react"
import GeneralSuspenseFallback from "../../../../../components/GeneralSuspenseFallback.tsx"

interface ExternalRedirectProps {
  url: string
}

export default function ExternalRedirect(props: ExternalRedirectProps) {
  useEffect(() => {
    window.location.replace(props.url)
  }, [props.url])

  return <GeneralSuspenseFallback />
}
