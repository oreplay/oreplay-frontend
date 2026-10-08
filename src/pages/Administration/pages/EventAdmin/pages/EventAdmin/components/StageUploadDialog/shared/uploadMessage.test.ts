import { describe, expect, it } from "vitest"
import enTranslation from "../../../../../../../../../../public/locales/en/translation.json"
import esTranslation from "../../../../../../../../../../public/locales/es/translation.json"
import { UPLOAD_MESSAGE_LEVEL } from "./uploadEntry.ts"
import {
  messageKeyOf,
  messageValuesOf,
  UNKNOWN_ERROR_MESSAGE_KEY,
  UNKNOWN_WARNING_MESSAGE_KEY,
  UPLOAD_MESSAGE_CODES,
} from "./uploadMessage.ts"

const TRANSLATED_LOCALES = [
  ["en", enTranslation],
  ["es", esTranslation],
] as const

function translationAt(translation: object, key: string): unknown {
  return key
    .split(".")
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      translation,
    )
}

describe("messageKeyOf", () => {
  it.each(UPLOAD_MESSAGE_CODES)("maps the backend code %s to its own key", (code) => {
    expect(messageKeyOf({ code, text: "Backend wording" })).toBe(
      `EventAdmin.DataUpload.messages.${code}`,
    )
  })

  it.each([
    ["record_not_found", "not_found"],
    ["unauthorized", "invalid_token"],
  ])("reuses the wording of an equivalent code for %s", (alias, code) => {
    expect(messageKeyOf({ code: alias })).toBe(messageKeyOf({ code }))
  })

  it("falls back to a generic error for an unknown error code", () => {
    const message = { code: "pdo", level: UPLOAD_MESSAGE_LEVEL.error, text: "SQLSTATE[23000]" }

    expect(messageKeyOf(message)).toBe(UNKNOWN_ERROR_MESSAGE_KEY)
  })

  it.each([
    { code: "unclassified", level: UPLOAD_MESSAGE_LEVEL.warning },
    { code: "brand_new_code", level: UPLOAD_MESSAGE_LEVEL.info },
    { text: "Message without code or level" },
  ])("falls back to a generic warning for %o", (message) => {
    expect(messageKeyOf(message)).toBe(UNKNOWN_WARNING_MESSAGE_KEY)
  })
})

describe("messageValuesOf", () => {
  it("returns the backend context to fill the translation", () => {
    const context = { bib: 12, class: "M21E" }

    expect(messageValuesOf({ context })).toEqual(context)
  })

  it("returns no values when the message has no context", () => {
    expect(messageValuesOf({})).toEqual({})
  })
})

describe.each(TRANSLATED_LOCALES)("%s translations", (_locale, translation) => {
  const keys = [
    ...UPLOAD_MESSAGE_CODES.map((code) => messageKeyOf({ code })),
    UNKNOWN_ERROR_MESSAGE_KEY,
    UNKNOWN_WARNING_MESSAGE_KEY,
  ]

  it.each(keys)("has a text for %s", (key) => {
    expect(translationAt(translation, key)).toEqual(expect.any(String))
  })
})
