import { useTranslationRanking } from "../../../../../../shared/useTranslationRanking.ts"
import { CategoryBucket } from "../shared/categorySelection.ts"

interface BucketOption {
  value: CategoryBucket
  label: string
}

interface CategoryChipProps {
  name: string
  currentBucket: CategoryBucket
  buckets: BucketOption[]
  onMove: (toBucket: CategoryBucket) => void
  onDragStart: () => void
}

export default function CategoryChip({
  name,
  currentBucket,
  buckets,
  onMove,
  onDragStart,
}: CategoryChipProps) {
  const { t } = useTranslationRanking()

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move"
        onDragStart()
      }}
      className="rk-category-chip flex items-center justify-between gap-1 rounded border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-800 hover:border-primary"
    >
      <span className="cursor-grab active:cursor-grabbing">{name}</span>
      <select
        aria-label={t("FedoStats.moveTo", { name })}
        value={currentBucket}
        onChange={(event) => onMove(event.target.value as CategoryBucket)}
        className="rounded border border-neutral-200 bg-transparent text-xs text-neutral-500"
      >
        {buckets.map((bucket) => (
          <option key={bucket.value} value={bucket.value}>
            {bucket.label}
          </option>
        ))}
      </select>
    </div>
  )
}
