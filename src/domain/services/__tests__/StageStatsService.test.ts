import { describe, it, expect } from "vitest"
import { stageStatsService } from "../StageStatsService"

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
        "1 Inscritos totales": {
          F: 0,
          M: 0,
          total: 0,
        },
        "2 Inscritos totales cat. <SUB-20": {
          F: 0,
          M: 0,
          total: 0,
        },
        "3 Inscritos totales cat. >SUB-20": {
          F: 0,
          M: 0,
          total: 0,
        },
        "4 No salen": {
          F: 0,
          M: 0,
          total: 0,
        },
        "5 Error en tarjeta": {
          F: 0,
          M: 0,
          total: 0,
        },
        "6 Abandonan": {
          F: 0,
          M: 0,
          total: 0,
        },
        "7 Fuera de control": {
          F: 0,
          M: 0,
          total: 0,
        },
        "8 Descalificados": {
          F: 0,
          M: 0,
          total: 0,
        },
      },
      table2: {
        "1 Inscritos totales": {
          F: 0,
          M: 0,
          total: 0,
        },
        "2 No salen": {
          F: 0,
          M: 0,
          total: 0,
        },
        "3 Error en tarjeta": {
          F: 0,
          M: 0,
          total: 0,
        },
        "4 Abandonan": {
          F: 0,
          M: 0,
          total: 0,
        },
        "5 Fuera de control": {
          F: 0,
          M: 0,
          total: 0,
        },
        "6 Descalificados": {
          F: 0,
          M: 0,
          total: 0,
        },
      },
    })
  })
})
