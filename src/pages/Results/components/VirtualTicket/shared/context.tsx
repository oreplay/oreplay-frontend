import { createContext } from "react"

interface VirtualTicketContextModel {
  isOpen: boolean
  handleClose: () => void
}

export const VirtualTicketContext = createContext<VirtualTicketContextModel>({
  isOpen: false,
  handleClose: () => {},
})
