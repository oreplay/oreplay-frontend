import { describe, it, expect } from "vitest"
import { stageStatsService } from "../StageStatsService"

const expectedProcessedData = {
  table1: {
    "1 Inscritos totales": { M: 407, F: 304, total: 711 },
    "2 Inscritos totales cat. <SUB-20": { M: 85, F: 93, total: 178 },
    "3 Inscritos totales cat. >SUB-20": { M: 322, F: 211, total: 533 },
    "4 No salen": { M: 26, F: 24, total: 50 },
    "5 Error en tarjeta": { M: 12, F: 6, total: 18 },
    "6 Abandonan": { M: 5, F: 4, total: 9 },
    "7 Fuera de control": { M: 2, F: 5, total: 7 },
    "8 Descalificados": { M: 1, F: 1, total: 2 },
  },
  table2: {
    "1 Inscritos totales": { M: 39, F: 50, total: 89 },
    "2 No salen": { M: 14, F: 18, total: 32 },
    "3 Error en tarjeta": { M: 1, F: 3, total: 4 },
    "4 Abandonan": { M: 1, F: 0, total: 1 },
    "5 Fuera de control": { M: 0, F: 0, total: 0 },
    "6 Descalificados": { M: 2, F: 0, total: 2 },
  },
}

describe("StageStatsService.processData", () => {
  it("returns correct empty data when passed empty stats", () => {
    const emptyStats = {
      total: 0,
      dns: 0,
      mp: 0,
      dnf: 0,
      ot: 0,
      dqf: 0,
      notYetFinished: 0,
      finished: 0,
      others: 0,
    }

    const emptyStatsByGender = {
      M: emptyStats,
      F: emptyStats,
    }

    expect(
      stageStatsService.processData({
        officialSub20: emptyStatsByGender,
        officialSenior: emptyStatsByGender,
        others: emptyStatsByGender,
      }),
    ).toEqual({
      table1: {
        "1 Inscritos totales": { M: 0, F: 0, total: 0 },
        "2 Inscritos totales cat. <SUB-20": { M: 0, F: 0, total: 0 },
        "3 Inscritos totales cat. >SUB-20": { M: 0, F: 0, total: 0 },
        "4 No salen": { M: 0, F: 0, total: 0 },
        "5 Error en tarjeta": { M: 0, F: 0, total: 0 },
        "6 Abandonan": { M: 0, F: 0, total: 0 },
        "7 Fuera de control": { M: 0, F: 0, total: 0 },
        "8 Descalificados": { M: 0, F: 0, total: 0 },
      },
      table2: {
        "1 Inscritos totales": { M: 0, F: 0, total: 0 },
        "2 No salen": { M: 0, F: 0, total: 0 },
        "3 Error en tarjeta": { M: 0, F: 0, total: 0 },
        "4 Abandonan": { M: 0, F: 0, total: 0 },
        "5 Fuera de control": { M: 0, F: 0, total: 0 },
        "6 Descalificados": { M: 0, F: 0, total: 0 },
      },
    })
  })

  it("returns correct data when passed some stats", () => {
    const apiStats = {
      officialSub20: {
        M: {
          classes: ["M-18E", "M-20E", "M-16", "M-14", "M-12", "M-16/18"],
          total: 85,
          dns: 5,
          mp: 6,
          dnf: 0,
          ot: 0,
          dqf: 0,
          notYetFinished: 0,
          finished: 74,
          others: 0,
          otherValues: [],
        },
        F: {
          classes: ["F-16", "F-14", "F-20E", "F-18E", "F-16/18", "F-12"],
          total: 93,
          dns: 5,
          mp: 0,
          dnf: 1,
          ot: 0,
          dqf: 0,
          notYetFinished: 0,
          finished: 87,
          others: 0,
          otherValues: [],
        },
      },
      officialSenior: {
        M: {
          classes: [
            "M-40",
            "M-21B",
            "M-55",
            "M-21A",
            "M-50",
            "M-45",
            "M-E",
            "M-35A",
            "M-60",
            "M-65",
            "M-70",
            "M-35B",
            "M-75",
          ],
          total: 322,
          dns: 21,
          mp: 6,
          dnf: 5,
          ot: 2,
          dqf: 1,
          notYetFinished: 0,
          finished: 287,
          others: 0,
          otherValues: [],
        },
        F: {
          classes: [
            "F-55",
            "F-45",
            "F-21A",
            "F-35A",
            "F-60",
            "F-40",
            "F-65",
            "F-21B",
            "F-E",
            "F-50",
            "F-35B",
            "F-70",
          ],
          total: 211,
          dns: 19,
          mp: 6,
          dnf: 3,
          ot: 5,
          dqf: 1,
          notYetFinished: 0,
          finished: 175,
          others: 2,
          otherValues: [9],
        },
      },
      others: {
        M: {
          classes: ["O AMARILLO", "O NEGRO M", "O NARANJA", "O ROJO M"],
          total: 39,
          dns: 14,
          mp: 1,
          dnf: 1,
          ot: 0,
          dqf: 2,
          notYetFinished: 0,
          finished: 21,
          others: 0,
          otherValues: [],
        },
        F: {
          classes: ["O AMARILLO", "O ROJO F", "O NARANJA", "O NEGRO F"],
          total: 50,
          dns: 18,
          mp: 3,
          dnf: 0,
          ot: 0,
          dqf: 0,
          notYetFinished: 0,
          finished: 29,
          others: 0,
          otherValues: [],
        },
        any: {
          classes: ["O AMARILLO", "O NEGRO M", "O ROJO F", "O NARANJA", "O ROJO M", "O NEGRO F"],
          total: 89,
          dns: 32,
          mp: 4,
          dnf: 1,
          ot: 0,
          dqf: 2,
          notYetFinished: 0,
          finished: 50,
          others: 0,
          otherValues: [],
        },
      },
    }

    expect(stageStatsService.processData(apiStats)).toEqual(expectedProcessedData)
  })
})

describe("StageStatsService.formatAsTxtTables", () => {
  it("returns correct csv/txt table", () => {
    const expectedTable =
      "; OFICIAL ; M ; F ; Total ;\n" +
      ";-----------;---;---;-------;\n" +
      "; 1 Inscritos totales ; 407 ; 304 ; 711 ;\n" +
      "; 2 Inscritos totales cat. <SUB-20 ; 85 ; 93 ; 178 ;\n" +
      "; 3 Inscritos totales cat. >SUB-20 ; 322 ; 211 ; 533 ;\n" +
      "; 4 No salen ; 26 ; 24 ; 50 ;\n" +
      "; 5 Error en tarjeta ; 12 ; 6 ; 18 ;\n" +
      "; 6 Abandonan ; 5 ; 4 ; 9 ;\n" +
      "; 7 Fuera de control ; 2 ; 5 ; 7 ;\n" +
      "; 8 Descalificados ; 1 ; 1 ; 2 ;\n" +
      "\n" +
      "; NO OFICIAL ; M ; F ; Total ;\n" +
      ";-----------;---;---;-------;\n" +
      "; 1 Inscritos totales ; 39 ; 50 ; 89 ;\n" +
      "; 2 No salen ; 14 ; 18 ; 32 ;\n" +
      "; 3 Error en tarjeta ; 1 ; 3 ; 4 ;\n" +
      "; 4 Abandonan ; 1 ; 0 ; 1 ;\n" +
      "; 5 Fuera de control ; 0 ; 0 ; 0 ;\n" +
      "; 6 Descalificados ; 2 ; 0 ; 2 ;\n\n"
    expect(stageStatsService.formatAsTxtTables(expectedProcessedData)).toEqual(expectedTable)
  })
})

describe("StageStatsService.formatAsHtmlTables", () => {
  it("returns correct html table", () => {
    const expectedTable =
      '<table border="1"><tbody><tr><td> OFICIAL </td><td> M </td><td> F </td><td> Total </td></tr><tr><td> 1 Inscritos totales </td><td> 407 </td><td> 304 </td><td> 711 </td></tr><tr><td> 2 Inscritos totales cat. &lt;SUB-20 </td><td> 85 </td><td> 93 </td><td> 178 </td></tr><tr><td> 3 Inscritos totales cat. &gt;SUB-20 </td><td> 322 </td><td> 211 </td><td> 533 </td></tr><tr><td> 4 No salen </td><td> 26 </td><td> 24 </td><td> 50 </td></tr><tr><td> 5 Error en tarjeta </td><td> 12 </td><td> 6 </td><td> 18 </td></tr><tr><td> 6 Abandonan </td><td> 5 </td><td> 4 </td><td> 9 </td></tr><tr><td> 7 Fuera de control </td><td> 2 </td><td> 5 </td><td> 7 </td></tr><tr><td> 8 Descalificados </td><td> 1 </td><td> 1 </td><td> 2 </td></tr></tbody></table></br><table border="1"><tbody><tr><td> NO OFICIAL </td><td> M </td><td> F </td><td> Total </td></tr><tr><td> 1 Inscritos totales </td><td> 39 </td><td> 50 </td><td> 89 </td></tr><tr><td> 2 No salen </td><td> 14 </td><td> 18 </td><td> 32 </td></tr><tr><td> 3 Error en tarjeta </td><td> 1 </td><td> 3 </td><td> 4 </td></tr><tr><td> 4 Abandonan </td><td> 1 </td><td> 0 </td><td> 1 </td></tr><tr><td> 5 Fuera de control </td><td> 0 </td><td> 0 </td><td> 0 </td></tr><tr><td> 6 Descalificados </td><td> 2 </td><td> 0 </td><td> 2 </td></tr></tbody></table></br>'
    expect(stageStatsService.formatAsHtmlTables(expectedProcessedData)).toEqual(expectedTable)
  })
})
