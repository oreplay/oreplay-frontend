import { describe, expect, it } from "vitest"
import { StatTable } from "./fedoStatsTables.ts"
import { tablesToHtml, tablesToText } from "./statsClipboard.ts"

const identity = (key: string) => key

const table: StatTable = {
  titleKey: "Official",
  rows: [{ labelKey: "Total", M: 3, F: 2, total: 5 }],
}

describe("tablesToText", () => {
  it("renders tab-separated rows with a title and header", () => {
    expect(tablesToText([table], identity)).toBe(
      ["Official", "\tFedoStats.male\tFedoStats.female\tFedoStats.total", "Total\t3\t2\t5"].join(
        "\n",
      ),
    )
  })
})

describe("tablesToHtml", () => {
  it("renders an html table with caption, header and rows", () => {
    const html = tablesToHtml([table], identity)
    expect(html).toContain("<caption>Official</caption>")
    expect(html).toContain("<td>Total</td><td>3</td><td>2</td><td>5</td>")
  })

  it("escapes html-significant characters in text cells", () => {
    const unsafe: StatTable = {
      titleKey: "M & F <all>",
      rows: [{ labelKey: "H-21 <A>", M: 1, F: 0, total: 1 }],
    }
    const html = tablesToHtml([unsafe], identity)
    expect(html).toContain("<caption>M &amp; F &lt;all&gt;</caption>")
    expect(html).toContain("<td>H-21 &lt;A&gt;</td>")
  })
})
