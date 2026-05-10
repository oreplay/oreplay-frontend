import { countryCode } from "../../domain/services/userCountry/userCountryModel.ts"
import { CSSProperties } from "react"

interface CountryFlagProps {
  code: countryCode
  disabled?: boolean
  slotProps?: slotProps
  host?: string
}

interface slotProps {
  picture?: CSSProperties
  image?: CSSProperties
}

/**
 * Renders a country flag using the <picture> element with WebP and PNG fallbacks.
 *
 * @example
 * ```tsx
 * <CountryFlag code="es" />
 * <CountryFlag code="us" disabled />
 * <CountryFlag code="fr" slotProps={{ picture: { borderRadius: 4 } }} />
 * ```
 */
export default function CountryFlag({
  code,
  slotProps,
  disabled,
  host = "https://flagcdn.com",
}: CountryFlagProps) {
  const opacity = slotProps?.image?.opacity ?? (disabled ? 0.3 : 1)
  const width = slotProps?.image?.width ?? 20

  return (
    <picture style={slotProps?.picture}>
      <source type="image/webp" srcSet={`${host}/w20/${code}.webp, ${host}/w40/${code}.webp 2x`} />
      <source type="image/png" srcSet={`${host}/w20/${code}.png, ${host}/w40/${code}.png 2x`} />
      <img
        src={`https://flagcdn.com/w20/${code}.png`}
        width={width}
        alt={`${code} flag`}
        loading="lazy"
        style={{
          opacity: opacity, // display the image disabled
          ...slotProps?.image,
        }}
      />
    </picture>
  )
}
