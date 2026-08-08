import { PdfElement, PdfSection } from "../../../../../../domain/types/v1api"
import { ExportRunner } from "../exportRunners.ts"
import { PdfTemplate } from "../pdfBook.ts"

const MARGIN_X = 20
const TOP_Y = 20
const MAX_Y = 280
const LINE_HEIGHT = 8
const CLASS_GAP = 8
const HEADING_SIZE = 16
const LINE_SIZE = 12

interface ClassGroup {
  className: string
  runners: ExportRunner[]
}

function groupByClass(runners: ExportRunner[]): ClassGroup[] {
  const groups = new Map<string, ExportRunner[]>()
  runners.forEach((runner) => {
    const group = groups.get(runner.class) ?? []
    group.push(runner)
    groups.set(runner.class, group)
  })
  return [...groups.entries()].map(([className, groupRunners]) => ({
    className,
    runners: groupRunners,
  }))
}

function podiumLine(runner: ExportRunner): string {
  return runner.club
    ? `${runner.position}. ${runner.fullname} - ${runner.club}`
    : `${runner.position}. ${runner.fullname}`
}

function buildSections(runners: ExportRunner[]): PdfSection[] {
  const elements: PdfElement[] = []
  let y = TOP_Y
  const addLine = (content: string, size: number) => {
    if (y > MAX_Y) {
      elements.push({ type: "breakPage" })
      y = TOP_Y
    }
    elements.push({ type: "text", content, size, position: { x: MARGIN_X, y } })
    y += LINE_HEIGHT
  }
  groupByClass(runners).forEach((group) => {
    y += CLASS_GAP
    addLine(group.className, HEADING_SIZE)
    group.runners.forEach((runner) => addLine(podiumLine(runner), LINE_SIZE))
  })
  return [{ elements }]
}

export const podiumA: PdfTemplate = {
  id: "podiumA",
  layout: "default",
  labelKey: "ExportResults.templates.podiumA",
  buildSections,
}
