import { CategoryBucket } from "../shared/categorySelection.ts"
import CategoryChip from "./CategoryChip.tsx"

interface BucketOption {
  value: CategoryBucket
  label: string
}

interface CategoryColumnProps {
  bucket: CategoryBucket
  label: string
  classNames: string[]
  bucketOptions: BucketOption[]
  isOver: boolean
  onDragStartClass: (className: string) => void
  onMoveClass: (className: string, toBucket: CategoryBucket) => void
  onDropClass: () => void
  onDragEnter: () => void
  onDragLeave: () => void
}

export default function CategoryColumn({
  bucket,
  label,
  classNames,
  bucketOptions,
  isOver,
  onDragStartClass,
  onMoveClass,
  onDropClass,
  onDragEnter,
  onDragLeave,
}: CategoryColumnProps) {
  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={(event) => {
        event.preventDefault()
        onDropClass()
      }}
      className={[
        "rk-category-column flex min-h-24 flex-col gap-2 rounded-lg border p-2 transition-colors",
        isOver ? "border-primary bg-primary/5" : "border-neutral-200",
      ].join(" ")}
    >
      <span className="text-sm font-semibold text-neutral-700">{label}</span>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {classNames.map((name) => (
          <li key={name}>
            <CategoryChip
              name={name}
              currentBucket={bucket}
              buckets={bucketOptions}
              onMove={(toBucket) => onMoveClass(name, toBucket)}
              onDragStart={() => onDragStartClass(name)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
