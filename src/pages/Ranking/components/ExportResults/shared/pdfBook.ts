import { PdfBook, PdfElement, PdfSection } from "../../../../../domain/types/v1api"
import { ExportRunner } from "./exportRunners.ts"

export interface PdfTemplate {
  id: string
  layout: string
  labelKey: string
  backgroundPdf?: string | null
  buildSections: (runners: ExportRunner[]) => PdfSection[]
}

export function onePagePerRunner(
  runners: ExportRunner[],
  renderRunner: (runner: ExportRunner) => PdfElement[],
): PdfSection[] {
  const pageBreak: PdfElement = { type: "breakPage" }
  const elements = runners.flatMap((runner, index) =>
    index < runners.length - 1 ? [...renderRunner(runner), pageBreak] : renderRunner(runner),
  )
  return [{ elements }]
}

export function buildPdfBook(
  template: PdfTemplate,
  runners: ExportRunner[],
  filename?: string,
  backgroundPdf?: string | null,
): PdfBook {
  const background = backgroundPdf === undefined ? template.backgroundPdf : backgroundPdf
  return {
    layout: template.layout,
    sections: template.buildSections(runners),
    ...(background ? { backgroundPdf: background } : {}),
    ...(filename ? { filename } : {}),
  }
}
