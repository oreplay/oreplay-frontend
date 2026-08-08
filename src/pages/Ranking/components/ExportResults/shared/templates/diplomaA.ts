import { PdfElement } from "../../../../../../domain/types/v1api"
import { ExportRunner } from "../exportRunners.ts"
import { onePagePerRunner, PdfTemplate } from "../pdfBook.ts"

const NAME_FONT_SIZE = 36
const DETAIL_FONT_SIZE = 24
const CLUB_FONT_SIZE = 18
const NAME_Y = 100
const DETAIL_Y = 150
const CLUB_Y = 180

function renderRunner(runner: ExportRunner): PdfElement[] {
  const elements: PdfElement[] = [
    {
      type: "centeredElement",
      content: runner.fullname,
      size: NAME_FONT_SIZE,
      position: { y: NAME_Y },
    },
    {
      type: "centeredElement",
      content: `${runner.class} · ${runner.position}`,
      size: DETAIL_FONT_SIZE,
      position: { y: DETAIL_Y },
    },
  ]
  if (runner.club) {
    elements.push({
      type: "centeredElement",
      content: runner.club,
      size: CLUB_FONT_SIZE,
      position: { y: CLUB_Y },
    })
  }
  return elements
}

export const diplomaA: PdfTemplate = {
  id: "diplomaA",
  layout: "default",
  labelKey: "ExportResults.templates.diplomaA",
  buildSections: (runners) => onePagePerRunner(runners, renderRunner),
}
