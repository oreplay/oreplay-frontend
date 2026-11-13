import { postListPdf } from "../../../../../infrastructure/repositories/pdf/pdf.ts"
import { PdfBook, PdfRequest } from "../../../../../domain/types/v1api"
import { ExportRunner } from "./exportRunners.ts"
import { buildPdfBook, PdfTemplate } from "./pdfBook.ts"
import { saveBlob } from "../../../shared/saveBlob.ts"

async function requestPdf(pdfBook: PdfBook): Promise<Blob> {
  const request: PdfRequest = { pdfBook }
  return postListPdf(request, { responseType: "blob" }) as unknown as Promise<Blob>
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
