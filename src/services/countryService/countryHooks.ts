import { useCallback, useContext } from "react"
import { countryLanguageContext } from "./countryContext.ts"
import countries from "i18n-iso-countries"
import type { GetNameOptions } from "i18n-iso-countries"

/**
 * React hook that returns a function to retrieve a localized country name
 * by its ISO 3166-1 alpha-2 country code.
 *
 * The returned function is memoized and will update whenever the current
 * language from {@link countryLanguageContext} changes.
 *
 * @returns A function that takes a country code
 * and returns the localized country name, or `undefined` if not found.
 *
 * @example
 * const getCountry = useCountry()
 * const name = getCountry("ES") // "Spain" (depending on language)
 */
export function useCountry() {
  const lng = useContext(countryLanguageContext)

  return useCallback((code: string) => countries.getName(code, lng), [lng])
}

/**
 * Represents a country with its ISO code and localized name.
 */
interface Country {
  /** ISO 3166-1 alpha-2 country code (e.g., "US", "ES") */
  code: string

  /** Localized country name (e.g., "United States", "España") */
  name: string
}

/**
 * React hook that returns a list of all countries with localized names.
 *
 * The list is generated using the current language from
 * {@link countryLanguageContext}.
 *
 * @param select - Determines which type of
 * country name to retrieve (e.g., "official", "alias", "all").
 *
 * @returns An array of country objects containing `code` and localized `name`.
 *
 * @example
 * const countries = useAllCountries()
 * // [{ code: "US", name: "United States" }, ...]
 *
 * @example
 * const countries = useAllCountries("alias")
 * // Uses alternative/alias country names if available
 */
export function useAllCountries(select: GetNameOptions["select"] = "official"): Country[] {
  const lng = useContext(countryLanguageContext)

  const localizedCountries = countries.getNames(lng, { select })

  return Object.entries(localizedCountries).map(([code, name]) => ({
    code,
    name,
  }))
}
