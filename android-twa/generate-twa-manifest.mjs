import { readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { loadEnv } from "vite"

const TWA_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(TWA_DIR, "..")
const TEMPLATE_PATH = resolve(TWA_DIR, "twa-manifest.template.json")
const OUTPUT_PATH = resolve(TWA_DIR, "twa-manifest.json")
const DEFAULT_KEYSTORE = "android.keystore"
const DEFAULT_KEY_ALIAS = "android"
const VERSION_PART_WEIGHTS = [1_000_000, 1_000, 1]

const mode = process.argv[2] ?? "production"
const env = loadEnv(mode, REPO_ROOT, "")

function requireEnv(name) {
  if (!env[name]) throw new Error(`${name} must be set in .env (mode: ${mode})`)
  return env[name]
}

const versionCodeFrom = (versionName) =>
  versionName
    .split(".")
    .map(Number)
    .reduce((code, part, index) => code + part * VERSION_PART_WEIGHTS[index], 0)

const website = new URL(requireEnv("VITE_WEBSITE_DOMAIN"))
const absoluteUrl = (path) => new URL(path, website).href
const versionName = requireEnv("VITE_VERSION_NUMBER")
const template = JSON.parse(readFileSync(TEMPLATE_PATH, "utf8"))

const manifest = {
  ...template,
  packageId: requireEnv("TWA_PACKAGE_ID"),
  host: website.host,
  iconUrl: absoluteUrl("/pwa-icons/icon-512.png"),
  maskableIconUrl: absoluteUrl("/pwa-icons/icon-maskable-512.png"),
  webManifestUrl: absoluteUrl("/manifest.webmanifest"),
  fullScopeUrl: absoluteUrl(template.startUrl),
  appVersionName: versionName,
  appVersion: versionName,
  appVersionCode: versionCodeFrom(versionName),
  signingKey: {
    path: resolve(TWA_DIR, env.TWA_KEYSTORE_PATH || DEFAULT_KEYSTORE),
    alias: env.TWA_KEY_ALIAS || DEFAULT_KEY_ALIAS,
  },
}

writeFileSync(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Wrote ${OUTPUT_PATH} for ${website.origin} (version ${versionName})`)
