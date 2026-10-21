import "../../../../styles/tokens.css"
import "../../../../styles/tailwind.css"
import { Dialog } from "@mui/material"
import React from "react"
import { ProcessedRunnerModel } from "./shared/EntityTypes.ts"
import { VirtualTicketContext } from "./shared/context.tsx"
import VirtualTicketCloseButton from "./components/VirtualTicketCloseButton.tsx"

export interface VirtualTicketProps {
  isTicketOpen: boolean
  runner: ProcessedRunnerModel | null
  handleCloseTicket: () => void
  setClassClubId: (newClassOrClubId: string, isClass: boolean) => void
  isClass?: boolean
}

type VirtualTicketContainerProps = {
  isTicketOpen: boolean
  runner: ProcessedRunnerModel | null
  handleCloseTicket: () => void
  children?: React.ReactNode
}

const DIALOG_INSET_PX = { xs: 16, sm: 32 }
const PAPER_SX = {
  width: "100%",
  maxWidth: 440,
  height: { xs: `calc(100% - ${2 * DIALOG_INSET_PX.xs}px)`, sm: "calc(100% - 5%)" },
  maxHeight: "none",
  margin: { xs: `${DIALOG_INSET_PX.xs}px`, sm: `${DIALOG_INSET_PX.sm}px` },
  borderRadius: "16px",
  overflow: "hidden",
}

/**
 * Dialog that frames every virtual ticket: a plain white sheet with a close button pinned to its
 * top right corner. The ticket's header and splits are its children and scroll together when the
 * ticket is taller than the screen, inside a scroller inset from the sheet's rounded corners so its
 * scrollbar never runs into them. It renders nothing without a runner.
 *
 * @param props.isTicketOpen Whether the dialog is shown.
 * @param props.runner Runner the ticket is about; `null` renders nothing.
 * @param props.handleCloseTicket Called when the user closes the dialog.
 * @param props.children The ticket's header and splits.
 */
export const VirtualTicketContainer: React.FC<VirtualTicketContainerProps> = ({
  isTicketOpen,
  runner,
  handleCloseTicket,
  children,
}) => {
  if (!runner) return null

  return (
    <Dialog
      open={isTicketOpen}
      onClose={handleCloseTicket}
      maxWidth={false}
      slotProps={{ paper: { sx: PAPER_SX } }}
    >
      <div className="virtual-ticket-container tw-root relative flex min-h-0 grow flex-col bg-white font-sans text-neutral-800">
        <VirtualTicketCloseButton onClick={handleCloseTicket} />
        <div className="virtual-ticket-scroller my-4 flex min-h-0 grow flex-col overflow-y-auto [scrollbar-width:thin]">
          <VirtualTicketContext.Provider
            value={{ isOpen: isTicketOpen, handleClose: handleCloseTicket }}
          >
            {children}
          </VirtualTicketContext.Provider>
        </div>
      </div>
    </Dialog>
  )
}
