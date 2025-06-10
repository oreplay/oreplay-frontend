import {
  VirtualTicketContainer,
  VirtualTicketProps,
} from "../../../../../../../../components/VirtualTicket/VirtualTicketContainer.tsx"
import NotImplementedAlertBox from "../../../../../../../../../../components/NotImplementedAlertBox.tsx"

export default function RelayVirtualTicket(props: VirtualTicketProps) {
  return (
    <VirtualTicketContainer
      isTicketOpen={props.isTicketOpen}
      runner={props.runner}
      handleCloseTicket={props.handleCloseTicket}
    >
      <NotImplementedAlertBox />
    </VirtualTicketContainer>
  )
}
