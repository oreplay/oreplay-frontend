import { describe, it, expect } from "vitest"
import { i18nLanguage2isoCountryLanguage } from "./countryService.ts"

describe("i18nLanguage2isoCountryLanguage", () => {
  it("converts i18n codes to ISO 639-1 uppercase", () => {
    expect(i18nLanguage2isoCountryLanguage("en-US")).toBe("EN")
    expect(i18nLanguage2isoCountryLanguage("fr")).toBe("FR")
    expect(i18nLanguage2isoCountryLanguage("de-DE")).toBe("DE")
    expect(i18nLanguage2isoCountryLanguage("zh-CN")).toBe("ZH")
  })
})
