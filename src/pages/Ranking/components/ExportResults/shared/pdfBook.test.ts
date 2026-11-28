import { describe, expect, it } from "vitest"
import { buildPdfBook, onePagePerRunner, PdfTemplate } from "./pdfBook.ts"
import { ExportRunner } from "./exportRunners.ts"

const runner = (over: Partial<ExportRunner>): ExportRunner => ({
  fullname: "Ada Lovelace",
  class: "W21",
  club: "OK Club",
  participants: null,
  sex: "F",
  position: 1,
  ...over,
})

const fakeTemplate: PdfTemplate = {
  id: "fake",
  layout: "fake-layout",
  labelKey: "x",
  buildSections: (runners) => [
    { elements: runners.map((r) => ({ type: "text", content: r.fullname })) },
  ],
}

describe("onePagePerRunner", () => {
  it("inserts a page break between runners but not after the last", () => {
    const sections = onePagePerRunner(
      [runner({ fullname: "A" }), runner({ fullname: "B" })],
      (r) => [{ type: "text", content: r.fullname }],
    )
    expect(sections[0].elements.map((element) => element.type)).toEqual([
      "text",
      "breakPage",
      "text",
    ])
  })
})

describe("buildPdfBook", () => {
  it("uses the template id as layout and its sections", () => {
    expect(buildPdfBook(fakeTemplate, [runner({ fullname: "A" })])).toEqual({
      layout: "fake-layout",
      sections: [{ elements: [{ type: "text", content: "A" }] }],
    })
  })

  it("includes the filename only when provided", () => {
    expect(buildPdfBook(fakeTemplate, [runner({})], "diplomas").filename).toBe("diplomas")
  })

  it("includes the template's backgroundPdf only when set", () => {
    expect(buildPdfBook(fakeTemplate, [runner({})]).backgroundPdf).toBeUndefined()
    const withBackground = { ...fakeTemplate, backgroundPdf: "http://example.test/bg.pdf" }
    expect(buildPdfBook(withBackground, [runner({})]).backgroundPdf).toBe(
      "http://example.test/bg.pdf",
    )
  })

  it("lets the backgroundPdf argument override the template's", () => {
    const withBackground = { ...fakeTemplate, backgroundPdf: "http://example.test/template.pdf" }
    expect(
      buildPdfBook(withBackground, [runner({})], undefined, "http://example.test/custom.pdf")
        .backgroundPdf,
    ).toBe("http://example.test/custom.pdf")
    expect(
      buildPdfBook(withBackground, [runner({})], undefined, null).backgroundPdf,
    ).toBeUndefined()
  })
})
