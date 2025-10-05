import { ProcessedStats, StatsTable } from "../models/ProcessedStats.ts"
import {
  CATEGORY_OFFICIAL_SENIOR,
  CATEGORY_OFFICIAL_SUB20,
  CATEGORY_OTHERS,
  CategoryData,
  CategoryName,
  ApiStats,
  StageStatsModel,
} from "../models/ApiStats.ts"
import { Gender, GENDERS } from "../models/Gender.ts"
import { get } from "../../services/ApiConfig.ts"
import { Data } from "../../shared/EntityTypes.ts"

function getGenders(categoryData: CategoryData): Gender[] {
  return Object.keys(categoryData).filter((key) => GENDERS.includes(key as Gender)) as Gender[]
}

function processData(data: ApiStats): ProcessedStats {
  const result: ProcessedStats = {
    table1: {},
    table2: {},
  }

  const rowsTable1 = [
    "1 Inscritos totales",
    "2 Inscritos totales cat. <SUB-20",
    "3 Inscritos totales cat. >SUB-20",
    "4 No salen",
    "5 Error en tarjeta",
    "6 Abandonan",
    "7 Fuera de control",
    "8 Descalificados",
  ]

  const rowsTable2 = [
    "1 Inscritos totales",
    "2 No salen",
    "3 Error en tarjeta",
    "4 Abandonan",
    "5 Fuera de control",
    "6 Descalificados",
  ]

  const initTable = (rows: string[]): StatsTable =>
    Object.fromEntries(rows.map((row) => [row, { M: 0, F: 0, total: 0 }])) as StatsTable

  result.table1 = initTable(rowsTable1)
  result.table2 = initTable(rowsTable2)

  const officialCategories: CategoryName[] = [CATEGORY_OFFICIAL_SUB20, CATEGORY_OFFICIAL_SENIOR]

  // Process official categories
  for (const categoryName of officialCategories) {
    const categoryData = data[categoryName]
    const genders = getGenders(categoryData)

    for (const gender of genders) {
      const cat = categoryData[gender]

      // General totals
      result.table1[rowsTable1[0]][gender] += cat.total

      // Sub-totals for categories
      if (categoryName === CATEGORY_OFFICIAL_SUB20) {
        result.table1[rowsTable1[1]][gender] += cat.total
      } else if (categoryName === CATEGORY_OFFICIAL_SENIOR) {
        result.table1[rowsTable1[2]][gender] += cat.total
      }

      // Common fields
      result.table1[rowsTable1[3]][gender] += cat.dns
      result.table1[rowsTable1[4]][gender] += cat.mp
      result.table1[rowsTable1[5]][gender] += cat.dnf
      result.table1[rowsTable1[6]][gender] += cat.ot
      result.table1[rowsTable1[7]][gender] += cat.dqf
    }
  }

  // Process non-official ("others") category
  const othersCategory = data[CATEGORY_OTHERS]
  const othersGenders = getGenders(othersCategory)

  for (const gender of othersGenders) {
    const cat = othersCategory[gender]

    result.table2[rowsTable2[0]][gender] += cat.total
    result.table2[rowsTable2[1]][gender] += cat.dns
    result.table2[rowsTable2[2]][gender] += cat.mp
    result.table2[rowsTable2[3]][gender] += cat.dnf
    result.table2[rowsTable2[4]][gender] += cat.ot
    result.table2[rowsTable2[5]][gender] += cat.dqf
  }

  // Totals
  const calculateTotals = (table: StatsTable): void => {
    for (const row of Object.keys(table)) {
      table[row].total = table[row].M + table[row].F
    }
  }

  calculateTotals(result.table1)
  calculateTotals(result.table2)

  return result
}

function formatAsTxtTables(result: ProcessedStats): string {
  const newLine = "\n"
  const sep = ";"
  const formatTable = (tableName: string, tableData: StatsTable): string => {
    let md = `${sep} ${tableName} ${sep} M ${sep} F ${sep} Total ${sep}${newLine}`
    md += `${sep}-----------${sep}---${sep}---${sep}-------${sep}` + newLine

    for (const [rowName, values] of Object.entries(tableData)) {
      md += `${sep} ${rowName} ${sep} ${values.M} ${sep} ${values.F} ${sep} ${values.total} ${sep}${newLine}`
    }

    md += newLine
    return md
  }

  let markdown = ""
  markdown += formatTable("OFICIAL", result.table1)
  markdown += formatTable("NO OFICIAL", result.table2)

  return markdown
}

function formatAsHtmlTables(result: ProcessedStats): string {
  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }
  const formatTable = (tableName: string, tableData: StatsTable): string => {
    let md = `<table border="1"><tbody><tr><td> ${tableName} </td><td> M </td><td> F </td><td> Total </td></tr>`
    // md += '<tr><td>-----------</td><td>---</td><td>---</td><td>-------</td><td>';

    for (const [rowName, values] of Object.entries(tableData)) {
      md += `<tr><td> ${escapeHtml(rowName)} </td><td> ${values.M} </td><td> ${values.F} </td><td> ${values.total} </td></tr>`
    }

    md += "</tbody></table></br>"
    return md
  }

  let html = ""
  html += formatTable("OFICIAL", result.table1)
  html += formatTable("NO OFICIAL", result.table2)

  return html
}

export const stageStatsService = {
  processData,
  formatAsTxtTables,
  formatAsHtmlTables,
}

export function getStageStats(eventId: string, stageId: string): Promise<Data<StageStatsModel[]>> {
  return get<Data<StageStatsModel[]>>(`events/${eventId}/stages/${stageId}/stats`)
}
