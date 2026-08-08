import { useTranslationRanking } from "../shared/useTranslationRanking.ts"
import { Progress } from "../shared/progress.ts"
import SpinnerRing from "./SpinnerRing.tsx"
import ProgressBar from "./ProgressBar.tsx"

interface ComputeProgressProps {
  progress: Progress | null
}

export default function ComputeProgress({ progress }: ComputeProgressProps) {
  const { t } = useTranslationRanking()

  return (
    <div className="rk-compute-progress flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <SpinnerRing className="h-4 w-4 border-2 border-primary" />
        <span className="text-sm text-neutral-600">
          {progress ? `${progress.completed} / ${progress.total}` : t("common:loading")}
        </span>
      </div>
      {progress && <ProgressBar value={progress.completed} max={progress.total} />}
    </div>
  )
}
