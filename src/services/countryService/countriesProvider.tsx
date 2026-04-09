import { ReactNode, useCallback, useEffect, useState } from "react"
import { countryLanguageContext } from "./countryContext.ts"
import i18n from "i18next"
import { i18nLanguage2isoCountryLanguage, registerCountryLng } from "./countryService.ts"

/**
 * Provide the required context for country localization with {@link useCountry} and
 * {@link useAllCountries}
 *
 * @example
 * <CountriesLocalizationProvider>
 *   <App />
 * </CountriesLocalizationProvider>
 */
export default function CountriesLocalizationProvider({ children }: { children: ReactNode }) {
  // state
  const [currentLng, setCurrentLng] = useState<string>("")

  // handle first language registration
  useEffect(() => {
    const firstLng = i18nLanguage2isoCountryLanguage(i18n.language)
    void registerCountryLng(firstLng).then(() => setCurrentLng(firstLng))
  }, [])

  // handle language update
  /// Define handler
  const updateHandler = useCallback(
    async (newLanguage: string): Promise<void> => {
      const code = i18nLanguage2isoCountryLanguage(newLanguage)
      const registeredCode = await registerCountryLng(code)
      setCurrentLng(registeredCode)
    },
    [setCurrentLng],
  )
  const updateHandlerSync = useCallback(
    (newLng: string) => {
      void updateHandler(newLng)
    },
    [updateHandler],
  )

  /// Register handler
  useEffect(() => {
    i18n.on("languageChanged", updateHandlerSync)

    return () => {
      i18n.off("languageChanged", updateHandlerSync)
    }
  }, [updateHandlerSync])

  // Return provider
  return (
    <countryLanguageContext.Provider value={currentLng}>{children}</countryLanguageContext.Provider>
  )
}
