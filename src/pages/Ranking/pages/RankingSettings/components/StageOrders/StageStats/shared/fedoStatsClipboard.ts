import { StatTable } from "./fedoStatsTables.ts"

type Translate = (key: string) => string

function headerCells(t: Translate): string[] {
  return ["", t("FedoStats.male"), t("FedoStats.female"), t("FedoStats.total")]
}

function tableToHtml(table: StatTable, t: Translate): string {
  const head = headerCells(t)
    .map((cell) => `<th>${cell}</th>`)
    .join("")
  const body = table.rows
    .map(
      (r) => `<tr><td>${t(r.labelKey)}</td><td>${r.M}</td><td>${r.F}</td><td>${r.total}</td></tr>`,
    )
    .join("")
  return `<table border="1"><caption>${t(table.titleKey)}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`
}

function tableToText(table: StatTable, t: Translate): string {
  const head = headerCells(t).join("\t")
  const rows = table.rows.map((r) => [t(r.labelKey), r.M, r.F, r.total].join("\t"))
  return [t(table.titleKey), head, ...rows].join("\n")
}

export function tablesToHtml(tables: StatTable[], t: Translate): string {
  return tables.map((table) => tableToHtml(table, t)).join("<br/>")
}

export function tablesToText(tables: StatTable[], t: Translate): string {
  return tables.map((table) => tableToText(table, t)).join("\n\n")
}

export async function writeToClipboard(html: string, text: string): Promise<void> {
  const canWriteRich =
    typeof ClipboardItem !== "undefined" && typeof navigator.clipboard?.write === "function"
  if (canWriteRich) {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" }),
      }),
    ])
    return
  }
  await navigator.clipboard.writeText(text)
}
