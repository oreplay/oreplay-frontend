import { Link } from "react-router-dom"
import { BreadcrumbItem } from "../../domain/breadcrumbs.ts"

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  label: string
  className?: string
}

export default function Breadcrumbs({ items, label, className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={["rk-breadcrumbs", className].filter(Boolean).join(" ")}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-sm text-neutral-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li
              key={item.label}
              className="flex items-center gap-2 before:text-neutral-300 before:content-['>'] first:before:hidden"
            >
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-medium text-neutral-700" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
