import { Trans } from "react-i18next"
import ControlBadge from "../../../../pages/RogainePoints/components/ControlBadge.tsx"
import { ProcessedSplitModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { punchedControls } from "../../shared/rogaineTicket.ts"

interface RogaineVirtualTicketPointsTabProps {
  controls: bigint[] | null
  splits: ProcessedSplitModel[] | null
}

/**
 * Every control of a rogaine course, marking the ones the team punched, under a count of them.
 *
 * @param props.controls Codes of every control of the course; `null` while unknown.
 * @param props.splits The team's splits, from which the punched controls are read.
 */
export default function RogaineVirtualTicketPointsTab({
  controls,
  splits,
}: RogaineVirtualTicketPointsTabProps) {
  const punched = punchedControls(splits)
  const controlList = controls ?? []

  return (
    <div className="rogaine-virtual-ticket-points-tab flex flex-col gap-3.5 pt-1">
      <p className="m-0 text-[13px] text-neutral-600">
        <Trans
          i18nKey="ResultsStage.VirtualTicket.ControlsPunched"
          values={{ punched: punched.length, total: controlList.length }}
          components={{ strong: <span className="font-semibold tabular-nums text-neutral-900" /> }}
        />
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] justify-items-center gap-2">
        {controlList.map((control) => (
          <ControlBadge
            key={control.toString()}
            number={control}
            punched={punched.includes(control)}
          />
        ))}
      </div>
    </div>
  )
}
