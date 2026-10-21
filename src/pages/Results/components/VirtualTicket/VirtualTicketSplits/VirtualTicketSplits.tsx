import React from "react"
import VirtualTicketNoDownloadMsg from "./components/VirtualTicketNoDownloadMsg.tsx"

type VirtualTicketSplitsProps = {
  children?: React.ReactNode
  download: boolean
  isDNS?: boolean
}

/**
 * Lower part of a virtual ticket that holds the splits. Without a chip reading, or when
 * the runner did not start, it explains that there are no splits instead.
 *
 * @param props.children The splits, shown only when the chip was read.
 * @param props.download Whether the runner's chip was read.
 * @param props.isDNS Whether the runner did not start.
 */
export const VirtualTicketSplits: React.FC<VirtualTicketSplitsProps> = ({
  children,
  download,
  isDNS,
}) => {
  const hasSplits = download && !isDNS

  return (
    <div className="virtual-ticket-splits flex flex-1 flex-col gap-3 px-4 pb-0 pt-1.5 sm:px-5 sm:pt-2">
      {hasSplits ? children : <VirtualTicketNoDownloadMsg />}
    </div>
  )
}
