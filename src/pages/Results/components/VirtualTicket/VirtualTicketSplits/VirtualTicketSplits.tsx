import React from "react"
import VirtualTicketNoDownloadMsg from "./components/VirtualTicketNoDownloadMsg.tsx"

type VirtualTicketSplitsProps = {
  children?: React.ReactNode
  download: boolean
}

export const VirtualTicketSplits: React.FC<VirtualTicketSplitsProps> = ({ children, download }) => {
  if (download) {
    return <>{children}</>
  } else {
    return <VirtualTicketNoDownloadMsg />
  }
}
