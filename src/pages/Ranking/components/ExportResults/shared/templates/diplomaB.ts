import { createDiploma } from "./diploma.ts"

const BACKGROUND_PDF = "http://d1ljmtj9ckzv64.cloudfront.net/fisioOreplay/fegado.pdf"

export const diplomaB = createDiploma({
  id: "diplomaB",
  labelKey: "ExportResults.templates.diplomaB",
  backgroundPdf: BACKGROUND_PDF,
  elements: [
    { content: (runner) => runner.fullname, size: 36, color: "#1e3c80", y: 180 },
    { content: (runner) => runner.class, size: 25, bold: true, x: 135, y: 122 },
    { content: (runner) => `${runner.position}`, size: 100, color: "#4b88cb", bold: true, y: 141 },
    { content: (runner) => runner.club, size: 19, y: 197 },
  ],
})
