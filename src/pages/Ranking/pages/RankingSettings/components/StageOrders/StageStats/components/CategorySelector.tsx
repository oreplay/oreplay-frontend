import { useState } from "react"
import { useTranslationRanking } from "../../../../../../shared/useTranslationRanking.ts"
import {
  CATEGORY_BUCKETS,
  CategoryBucket,
  CategorySelection,
} from "../shared/officialCategories.ts"
import CategoryColumn from "./CategoryColumn.tsx"

interface CategorySelectorProps {
  selection: CategorySelection
  onMove: (className: string, toBucket: CategoryBucket) => void
}

export default function CategorySelector({ selection, onMove }: CategorySelectorProps) {
  const { t } = useTranslationRanking()
  const [dragged, setDragged] = useState<string | null>(null)
  const [overBucket, setOverBucket] = useState<CategoryBucket | null>(null)

  const drop = (bucket: CategoryBucket) => {
    if (dragged) onMove(dragged, bucket)
    setDragged(null)
    setOverBucket(null)
  }

  return (
    <div className="rk-category-selector grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {CATEGORY_BUCKETS.map((bucket) => (
        <CategoryColumn
          key={bucket}
          label={t(`FedoStats.buckets.${bucket}`)}
          classNames={selection[bucket]}
          isOver={overBucket === bucket}
          onDragStartClass={setDragged}
          onDragEnter={() => setOverBucket(bucket)}
          onDragLeave={() => setOverBucket((prev) => (prev === bucket ? null : prev))}
          onDropClass={() => drop(bucket)}
        />
      ))}
    </div>
  )
}
