import { RadioSplitModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS_TEXT } from "../../../../../../../shared/constants.ts"

interface OnlineControlsRowProps {
  onlineSplits: RadioSplitModel[] | null | undefined
  finishTime: string | null
  statusCode: string | null
}

function formatSeconds(seconds: number | null): string | null {
  if (seconds === null) return null
  const sign = seconds < 0 ? "-" : ""
  const abs = Math.abs(Math.round(seconds))
  const m = Math.floor(abs / 60)
  const s = abs % 60
  return `${sign}${m}:${s.toString().padStart(2, "0")}`
}

function getCircleClasses(
  split: RadioSplitModel,
  hasFinished: boolean,
  statusCode: string | null,
): string {
  const punched = split.reading_time !== null

  if (statusCode === RESULT_STATUS_TEXT.mp) {
    // whole run is flagged MP: punched controls stay purple,
    // any control not actually punched is the culprit → red
    return punched ? "bg-purple-600 text-white" : "bg-red-500 text-white"
  }
  if (statusCode === RESULT_STATUS_TEXT.ok) {
    return punched ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
  }
  // Fallback for any other/unknown status_code
  if (hasFinished && !punched) {
    return "bg-red-500 text-white"
  }
  return punched ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
}

export default function OnlineControlsRow({
  onlineSplits,
  finishTime,
  statusCode,
}: OnlineControlsRowProps) {
  if (!onlineSplits || onlineSplits.length === 0) return null

  const hasFinished = finishTime !== null

  return (
    <div className="flex w-full basis-full items-start overflow-x-auto py-2 px-1">
      <div className="flex flex-col items-center min-w-[24px]">
        <div className="w-0 h-0 border-l-[9px] border-r-[9px] border-b-[15px] border-l-transparent border-r-transparent border-b-gray-800" />
      </div>

      {onlineSplits.map((split) => {
        const circleClasses = getCircleClasses(split, hasFinished, statusCode)
        const time = formatSeconds(split.cumulative_time)
        const behind = formatSeconds(split.cumulative_behind)

        return (
          <div key={split.id} className="flex items-start">
            <div className="w-6 sm:w-10 h-[2px] bg-gray-300 mt-4 shrink-0" />
            <div className="flex flex-col items-center min-w-[52px] shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${circleClasses}`}
              >
                {split.control?.station ?? ""}
              </div>
              <div className="mt-1 flex flex-col items-center leading-tight">
                {time !== null && <span className="text-[11px] text-gray-700">{time}</span>}
                {behind !== null && (
                  <span className="text-[10px] text-gray-400">
                    {Number(split.cumulative_behind) > 0 ? `+${behind}` : behind}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <div className="flex items-start">
        <div className="w-6 sm:w-10 h-[2px] bg-gray-300 mt-4 shrink-0" />
        <div className="flex flex-col items-center min-w-[52px] shrink-0">
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              hasFinished ? "border-gray-800" : "border-gray-300"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${hasFinished ? "bg-gray-800" : "bg-gray-300"}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
