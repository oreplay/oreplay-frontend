import { PdfElement } from "../../../../../../domain/types/v1api"
import { ExportRunner } from "../exportRunners.ts"
import { onePagePerRunner, PdfTemplate } from "../pdfBook.ts"

const BOLD_STYLE = "bold"

export interface DiplomaElement {
  content: (runner: ExportRunner) => string | null | undefined
  size: number
  y: number
  x?: number
  color?: string
  bold?: boolean
}

function renderElement(element: DiplomaElement, content: string): PdfElement {
  return {
    type: element.x === undefined ? "centeredElement" : "text",
    content,
    size: element.size,
    position: element.x === undefined ? { y: element.y } : { x: element.x, y: element.y },
    ...(element.color ? { color: element.color } : {}),
    ...(element.bold ? { style: BOLD_STYLE } : {}),
  }
}

function renderRunner(runner: ExportRunner, elements: DiplomaElement[]): PdfElement[] {
  return elements.flatMap((element) => {
    const content = element.content(runner)
    return content ? [renderElement(element, content)] : []
  })
}

interface DiplomaOptions {
  id: string
  labelKey: string
  backgroundPdf: string | null
  elements: DiplomaElement[]
}

export function createDiploma({
  id,
  labelKey,
  backgroundPdf,
  elements,
}: DiplomaOptions): PdfTemplate {
  return {
    id,
    layout: "default",
    labelKey,
    backgroundPdf,
    buildSections: (runners) =>
      onePagePerRunner(runners, (runner) => renderRunner(runner, elements)),
  }
}
