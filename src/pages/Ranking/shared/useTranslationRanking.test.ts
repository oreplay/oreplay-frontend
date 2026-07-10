import { beforeAll, describe, it, expect } from "vitest"
import { createInstance, type Resource } from "i18next"
import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, relative, resolve } from "node:path"
import { usedNamespaces } from "../../../supportedLanguages.tsx"
import { RANKING_NAMESPACE } from "./useTranslationRanking.ts"

const HERE = dirname(fileURLToPath(import.meta.url))
const RANKING_DIR = resolve(HERE, "..")
const ENGLISH_LOCALE_DIR = resolve(HERE, "../../../../public/locales/en")

// Every registered namespace is loaded from disk, so a new namespace needs no
// change here — and its keys are checked the moment ranking code uses them.
const englishResources = (): Resource => ({
  en: Object.fromEntries(
    usedNamespaces.map((namespace) => [
      namespace,
      JSON.parse(readFileSync(join(ENGLISH_LOCALE_DIR, `${namespace}.json`), "utf8")) as Record<
        string,
        unknown
      >,
    ]),
  ),
})

const i18n = createInstance()

beforeAll(async () => {
  await i18n.init({
    lng: "en",
    fallbackLng: "en",
    ns: usedNamespaces,
    defaultNS: "translation",
    resources: englishResources(),
  })
})

// `exists` resolves against `ns` unless the key carries its own `<ns>:` prefix,
// which wins — so this covers bare ranking keys and prefixed foreign ones alike.
const expectResolves = (key: string) => {
  expect(i18n.exists(key, { ns: RANKING_NAMESPACE }), `key does not exist: ${key}`).toBe(true)
  const translated = i18n.getFixedT(null, RANKING_NAMESPACE)(key)
  expect(translated, `key resolves to itself: ${key}`).not.toBe(key)
}

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : []
  })

// The lookbehind keeps `split("/")` and friends from looking like a `t("…")` call.
const T_CALL = /(?<![\w$.])t\("([^"]+)"\)/g
const LABEL_KEY = /labelKey:\s*"([^"]+)"/g

const usedKeys = sourceFiles(RANKING_DIR).flatMap((file) => {
  const source = readFileSync(file, "utf8")
  return [...source.matchAll(T_CALL), ...source.matchAll(LABEL_KEY)].map(([, key]) => ({
    key,
    file: relative(RANKING_DIR, file),
  }))
})

describe("ranking namespace", () => {
  it("is registered, so every locale is checked for a ranking.json", () => {
    expect(usedNamespaces).toContain(RANKING_NAMESPACE)
  })

  it("resolves common: keys from a ranking-bound t", () => {
    expect(i18n.getFixedT(null, RANKING_NAMESPACE)("common:save")).toBe("Save")
  })

  it("resolves translation: keys from a ranking-bound t", () => {
    expectResolves("translation:Event")
  })

  // Asserted via `exists`, not `t()`: the English value equals the key, so a
  // missing key would echo back "Rankings" and silently pass.
  it("keeps the sidebar nav label in the translation namespace", () => {
    expect(i18n.exists("Rankings", { ns: "translation" })).toBe(true)
    expect(i18n.exists("Menu", { ns: RANKING_NAMESPACE })).toBe(false)
  })

  it("finds the keys to check", () => {
    expect(usedKeys.length).toBeGreaterThan(50)
  })

  // Every literal key the feature renders, scanned from source: a bare key that
  // belongs to another namespace resolves to itself and is shown to the user.
  it.each(usedKeys)("$file renders $key", ({ key }) => {
    expectResolves(key)
  })
})
