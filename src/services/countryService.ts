import { countryCode } from "../domain/services/userCountry/userCountryModel.ts"
import countries, { LocaleData } from "i18n-iso-countries"
import { captureException as sentryCaptureException } from "@sentry/react"

/**
 * A mapping from language codes (ISO 639-1) to dynamic import functions
 * that load the corresponding `i18n-iso-countries` locale JSON.
 *
 * Each function returns a Promise resolving to a `LocaleData` object.
 *
 * Example usage:
 * ```ts
 * const localeData = await langMap["fr"]();
 * countries.registerLocale(localeData.default);
 * ```
 */
const langMap: Record<string, () => Promise<LocaleData>> = {
  bg: () => import("i18n-iso-countries/langs/bg.json"),
  ca: () => import("i18n-iso-countries/langs/ca.json"),
  cs: () => import("i18n-iso-countries/langs/cs.json"),
  de: () => import("i18n-iso-countries/langs/de.json"),
  en: () => import("i18n-iso-countries/langs/en.json"),
  es: () => import("i18n-iso-countries/langs/es.json"),
  eu: () => import("i18n-iso-countries/langs/eu.json"),
  fi: () => import("i18n-iso-countries/langs/fi.json"),
  fr: () => import("i18n-iso-countries/langs/fr.json"),
  gl: () => import("i18n-iso-countries/langs/gl.json"),
  hu: () => import("i18n-iso-countries/langs/hu.json"),
  it: () => import("i18n-iso-countries/langs/it.json"),
  pl: () => import("i18n-iso-countries/langs/pl.json"),
  pt: () => import("i18n-iso-countries/langs/pt.json"),
  ru: () => import("i18n-iso-countries/langs/ru.json"),
  sv: () => import("i18n-iso-countries/langs/sv.json"),
  tr: () => import("i18n-iso-countries/langs/tr.json"),
  uk: () => import("i18n-iso-countries/langs/uk.json"),
  zh: () => import("i18n-iso-countries/langs/zh.json"),
}

/**
 * Converts an i18n language code (like `"en-US"`) to an ISO 639-1
 * two-letter country language code (like `"EN"`).
 *
 * Only the first part before `"-"` is used and converted to uppercase.
 *
 * @param {string} lng - The i18n language code, e.g. `"en-US"` or `"fr"`
 * @returns {string} The corresponding ISO 639-1 language code in uppercase
 *
 * @example
 * ```ts
 * i18nLanguage2isoCountryLanguage("en-US"); // returns "EN"
 * i18nLanguage2isoCountryLanguage("fr");    // returns "FR"
 * ```
 */
export function i18nLanguage2isoCountryLanguage(lng: string): countryCode {
  return lng.split("-")[0].toUpperCase()
}

/**
 * Dynamically registers a country locale for `i18n-iso-countries` based
 * on the provided language code.
 *
 * This function:
 * - If the language is not supported, it falls back to English (`en`).
 * - Registers the locale with `countries.registerLocale`.
 * - Logs and reports any errors to Sentry.
 *
 * Example usage:
 * ```ts
 * await registerCountryLng("fr"); // Loads and registers French country names
 * ```
 *
 * @param {string} languageCode - The i18n language code, e.g., `"en-US"` or `"fr"`.
 * @returns {Promise<void>} Resolves when the locale is registered, or rejects if all attempts fail.
 */
export async function registerCountryLng(languageCode: string): Promise<void> {
  const code = languageCode.toLowerCase()
  console.debug("registerCountryLng", languageCode)

  try {
    const localeData = await langMap[code]()
    countries.registerLocale(localeData)
  } catch (error) {
    console.error(`Could not register country language ${code}: `, error)
    try {
      const localeData = await langMap["en"]()
      countries.registerLocale(localeData)
      sentryCaptureException(error)
    } catch (error) {
      console.error(`Could not register fallback language en: `, error)
    }
  }
}
