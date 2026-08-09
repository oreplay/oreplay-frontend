import { PdfElement } from "../../../../../../domain/types/v1api"
import { ExportRunner } from "../exportRunners.ts"
import { onePagePerRunner, PdfTemplate } from "../pdfBook.ts"

const BACKGROUND_PDF = "http://d1ljmtj9ckzv64.cloudfront.net/fisioOreplay/fedo.pdf"
const NAME_COLOR = "#1e3c80"
const NAME_FONT_SIZE = 36
const CLASS_FONT_SIZE = 16
const POSITION_FONT_SIZE = 22
const CLUB_FONT_SIZE = 19
const CLASS_Y = 154
const POSITION_Y = 161
const NAME_Y = 170
const CLUB_Y = 188

function renderRunner(runner: ExportRunner): PdfElement[] {
  const elements: PdfElement[] = [
    {
      type: "centeredElement",
      content: runner.fullname,
      size: NAME_FONT_SIZE,
      color: NAME_COLOR,
      position: { y: NAME_Y },
    },
    {
      type: "centeredElement",
      content: runner.class,
      size: CLASS_FONT_SIZE,
      position: { y: CLASS_Y },
    },
    {
      type: "centeredElement",
      content: `${runner.position}`,
      size: POSITION_FONT_SIZE,
      position: { y: POSITION_Y },
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
  backgroundPdf: BACKGROUND_PDF,
  buildSections: (runners) => onePagePerRunner(runners, renderRunner),
}
