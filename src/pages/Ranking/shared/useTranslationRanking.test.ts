import { describe, it, expect } from "vitest"
import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, relative, resolve } from "node:path"
import i18n from "../../../test/i18n.ts"
import { usedNamespaces } from "../../../supportedLanguages.tsx"
import { RANKING_NAMESPACE } from "./useTranslationRanking.ts"

const RANKING_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..")

const t = i18n.getFixedT(null, RANKING_NAMESPACE)

// `exists` resolves against `ns` unless the key carries its own `<ns>:` prefix,
// which wins — so this covers bare ranking keys and prefixed foreign ones alike.
const expectResolves = (key: string) => {
  expect(i18n.exists(key, { ns: RANKING_NAMESPACE }), `key does not exist: ${key}`).toBe(true)
  expect(t(key), `key resolves to itself: ${key}`).not.toBe(key)
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
    expect(t("common:save")).toBe("Save")
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
