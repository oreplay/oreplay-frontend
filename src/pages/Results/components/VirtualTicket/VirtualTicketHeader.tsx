import React from "react"

type VirtualTicketHeaderProps = {
  children?: React.ReactNode
}

/**
 * Top block of a virtual ticket: the runner's name and details followed by the result summary.
 *
 * @param props.children The runner info and the summary of the result.
 */
export const VirtualTicketHeader: React.FC<VirtualTicketHeaderProps> = ({ children }) => {
  return (
    <header className="virtual-ticket-header flex flex-col gap-3 px-4 pb-3.5 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
      {children}
    </header>
  )
}
