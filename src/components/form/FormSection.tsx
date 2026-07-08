import { ReactNode } from "react"

interface FormSectionProps {
  title: string
  children: ReactNode
  description?: string
  className?: string
}

export default function FormSection({ title, children, description, className }: FormSectionProps) {
  return (
    <section
      aria-label={title}
      className={["rk-form-section flex flex-col gap-3", className].filter(Boolean).join(" ")}
    >
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-sm font-semibold text-neutral-700">{title}</h2>
        {description && <p className="m-0 text-xs text-neutral-500">{description}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </section>
  )
}
