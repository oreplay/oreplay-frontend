import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag"
import { useTranslation } from "react-i18next"
import { ControlModel } from "../../../../shared/EntityTypes.ts"
import { isFinishOrder } from "./shared/ticketDisplay.ts"

type VirtualTicketControlProps = {
  order_number: number | bigint | null
  control: ControlModel | null
  points?: bigint | number | null
  isMissed?: boolean
}

/**
 * Control cell of a splits row: the punching order with the control code in parentheses, plus the
 * points the control gives when it has any. The finish shows a flag instead.
 *
 * @param props.order_number Punched order of the control; `Infinity` for the finish.
 * @param props.control Control that represents; its station is the code.
 * @param props.points Points given by this control; nothing is shown when it gives none.
 * @param props.isMissed Whether the runner missed the control, which turns its code red.
 */
export default function VirtualTicketControl({
  order_number,
  control,
  points,
  isMissed,
}: VirtualTicketControlProps) {
  const { t } = useTranslation()
  const codeColorClass = isMissed ? "text-red-700" : "text-neutral-900"

  if (isFinishOrder(order_number)) {
    return (
      <span
        role="cell"
        className="virtual-ticket-control flex items-center gap-1.5 text-[13px] font-semibold text-neutral-900"
      >
        <OutlinedFlagIcon sx={{ fontSize: 16 }} className="text-neutral-600" />
        {t("ResultsStage.VirtualTicket.FinishControl")}
      </span>
    )
  }

  return (
    <span
      role="cell"
      className="virtual-ticket-control flex flex-wrap items-baseline gap-x-1.5 tabular-nums"
    >
      <span className="min-w-[18px] text-sm font-semibold text-neutral-900 sm:text-[15px]">
        {order_number?.toString()}
      </span>
      <span className={`text-xs ${codeColorClass}`}>({control?.station.toString()})</span>
      {points ? <span className="text-xs text-neutral-500">+{points.toString()}</span> : null}
    </span>
  )
}
