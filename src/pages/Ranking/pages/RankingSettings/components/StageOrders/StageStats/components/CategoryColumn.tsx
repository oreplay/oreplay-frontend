interface CategoryColumnProps {
  label: string
  classNames: string[]
  isOver: boolean
  onDragStartClass: (className: string) => void
  onDropClass: () => void
  onDragEnter: () => void
  onDragLeave: () => void
}

export default function CategoryColumn({
  label,
  classNames,
  isOver,
  onDragStartClass,
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
            <div
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move"
                onDragStartClass(name)
              }}
              className="cursor-grab rounded border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-800 hover:border-primary active:cursor-grabbing"
            >
              {name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
