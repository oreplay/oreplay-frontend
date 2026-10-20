/**
 * Faint dash between two items of the details line of a virtual ticket. Assistive technology
 * skips it.
 */
export default function VirtualTicketMetaSeparator() {
  return (
    <span aria-hidden="true" className="virtual-ticket-meta-separator text-neutral-400">
      –
    </span>
  )
}
