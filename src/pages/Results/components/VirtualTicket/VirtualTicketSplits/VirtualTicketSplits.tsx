import React from "react"
import VirtualTicketNoDownloadMsg from "./components/VirtualTicketNoDownloadMsg.tsx"

type VirtualTicketSplitsProps = {
  children?: React.ReactNode
  download: boolean
  isDNS?: boolean
}

export const VirtualTicketSplits: React.FC<VirtualTicketSplitsProps> = ({
  children,
  download,
  isDNS,
}) => {
  // console.log(isDNS)
  if (download && !isDNS) {
    return <>{children}</>
  } else {
    return <VirtualTicketNoDownloadMsg />
  }
}
