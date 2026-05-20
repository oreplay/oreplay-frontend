import { ReactNode } from "react"
import CountryFlag from "./components/CountryFlag/index.tsx"

interface Language {
  code: string
  flag: ReactNode
  name: string
}

const border = {
  slotProps: {
    image: {
      border: "1px solid #e5e7eb",
    },
  },
}

export const supportedLanguages: Language[] = [
  { code: "en-UK", flag: <CountryFlag code="gb" />, name: "English (UK)" },
  { code: "en-US", flag: <CountryFlag code="us" />, name: "English (US)" },
  { code: "ca", flag: <CountryFlag code="ca" host="/img/flags" />, name: "Català" },
  { code: "cs", flag: <CountryFlag code="cz" {...border} />, name: "Čeština" },
  { code: "eu", flag: <CountryFlag code="eu" host="/img/flags" />, name: "Euskara" },
  { code: "es", flag: <CountryFlag code="es" />, name: "Español" },
  { code: "fr", flag: <CountryFlag code="fr" />, name: "Français" },
  { code: "gl", flag: <CountryFlag code="gl" host="img/flags" {...border} />, name: "Galego" },
  { code: "pl", flag: <CountryFlag code="pl" {...border} />, name: "Polski" },
  { code: "pt", flag: <CountryFlag code="pt" />, name: "Português" },
  { code: "bg", flag: <CountryFlag code="bg" {...border} />, name: "български" },
  { code: "ru", flag: <CountryFlag code="ru" {...border} />, name: "Русский" },
  { code: "uk", flag: <CountryFlag code="ua" />, name: "українська" },
]

export const usedNamespaces: string[] = [
  "translation",
  "organizers",
  "about-us",
  "PrivacyPolicy",
  "LegalNotice",
  "CookiesPolicy",
]
