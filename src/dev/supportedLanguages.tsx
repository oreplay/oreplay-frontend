// Trimmed copy of the host's `src/supportedLanguages.tsx` — same language codes
// and names, but WITHOUT the `flag` <CountryFlag/> JSX, which would pull host UI
// components and flag assets into this dev-only shell. The i18n config only
// reads `code`, so this is enough to keep `src/dev/i18n.ts` byte-identical to
// the host's `src/i18n.ts`. (Kept as `.tsx` to match that verbatim import path.)
interface Language {
  code: string
  name: string
}

export const supportedLanguages: Language[] = [
  { code: "en-UK", name: "English (UK)" },
  { code: "en-US", name: "English (US)" },
  { code: "ca", name: "Català" },
  { code: "cs", name: "Čeština" },
  { code: "eu", name: "Euskara" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "gl", name: "Galego" },
  { code: "pl", name: "Polski" },
  { code: "pt", name: "Português" },
  { code: "bg", name: "български" },
  { code: "ru", name: "Русский" },
  { code: "uk", name: "українська" },
]
