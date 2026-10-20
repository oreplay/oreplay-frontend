import { useTranslation } from "react-i18next"
import { STATUS_CHIP_VARIANT, statusChipVariant, statusLabelKey } from "../shared/ticketDisplay.ts"

interface VirtualTicketStatusChipProps {
  status: string
}

const VARIANT_CLASS = {
  [STATUS_CHIP_VARIANT.Error]: "bg-red-100 text-red-800",
  [STATUS_CHIP_VARIANT.Neutral]: "bg-[#ececec] text-neutral-700",
}

/**
 * Small label with the full name of a result status, such as "Did not start". A mispunch is red,
 * every other status grey.
 *
 * @param props.status Status text, as returned by `parseResultStatus`.
 */
export default function VirtualTicketStatusChip({ status }: VirtualTicketStatusChipProps) {
  const { t } = useTranslation()
  const variantClass = VARIANT_CLASS[statusChipVariant(status)]

  return (
    <span
      className={`virtual-ticket-status-chip inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-md px-2 text-xs font-semibold tracking-[0.02em] ${variantClass}`}
    >
      {t(statusLabelKey(status))}
    </span>
  )
}
