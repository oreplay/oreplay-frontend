// @vitest-environment node

import { describe, it, expect } from "vitest"
import { readdirSync } from "node:fs"
import { access } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import { supportedLanguages, usedNamespaces } from "./supportedLanguages.tsx"

const __dirname: string = dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = resolve(__dirname, "../public/locales")

const localeDirs = readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

const supportedLocales = [
  ...new Set(supportedLanguages.map(({ code }) => code.split("-")[0])),
].sort()

describe("public/locales — required JSON files", () => {
  it("should have at least one supported language defined", () => {
    expect(supportedLanguages.length).toBeGreaterThan(0)
  })

  it.each(supportedLocales)("supported language %s has a locale directory", (lang) => {
    expect(localeDirs, `Missing directory: public/locales/${lang}`).toContain(lang)
  })

  describe.each(localeDirs)("locale: %s", (lang) => {
    it.each(usedNamespaces)("%s.json exists", async (namespace) => {
      const filePath = resolve(LOCALES_DIR, lang, `${namespace}.json`)
      await expect(
        access(filePath),
        `Missing file: public/locales/${lang}/${namespace}.json`,
      ).resolves.toBeUndefined()
    })
  })
})
