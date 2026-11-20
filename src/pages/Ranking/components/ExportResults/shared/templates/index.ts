import { PdfTemplate } from "../pdfBook.ts"
import { diplomaA } from "./diplomaA.ts"
import { diplomaB } from "./diplomaB.ts"
import { podiumA } from "./podiumA.ts"

export const PDF_TEMPLATES: PdfTemplate[] = [diplomaA, diplomaB, podiumA]

export const DEFAULT_PDF_TEMPLATE = diplomaA

export function findPdfTemplate(id: string): PdfTemplate {
  return PDF_TEMPLATES.find((template) => template.id === id) ?? DEFAULT_PDF_TEMPLATE
}
