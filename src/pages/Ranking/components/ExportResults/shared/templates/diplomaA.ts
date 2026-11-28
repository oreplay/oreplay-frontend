import { createDiploma } from "./diploma.ts"

export const diplomaA = createDiploma({
  id: "diplomaA",
  labelKey: "ExportResults.templates.diplomaA",
  backgroundPdf: null,
  elements: [
    { content: (runner) => runner.fullname, size: 36, color: "#1e3c80", y: 170 },
    { content: (runner) => runner.class, size: 16, y: 154 },
    { content: (runner) => `${runner.position}`, size: 22, y: 161 },
    { content: (runner) => runner.club, size: 19, y: 188 },
  ],
})
