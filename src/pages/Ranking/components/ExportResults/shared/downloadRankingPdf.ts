import { postListPdf } from "../../../../../infrastructure/repositories/pdf/pdf.ts"
import { PdfBook, PdfRequest } from "../../../../../domain/types/v1api"
import { ExportRunner } from "./exportRunners.ts"
import { buildPdfBook, PdfTemplate } from "./pdfBook.ts"

async function requestPdf(pdfBook: PdfBook): Promise<Blob> {
  const request: PdfRequest = { pdfBook }
  return postListPdf(request, { responseType: "blob" }) as unknown as Promise<Blob>
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function downloadRankingPdf(
  template: PdfTemplate,
  runners: ExportRunner[],
  filename: string,
  backgroundPdf?: string | null,
): Promise<void> {
  const blob = await requestPdf(buildPdfBook(template, runners, filename, backgroundPdf))
  saveBlob(blob, `${filename}.pdf`)
}
