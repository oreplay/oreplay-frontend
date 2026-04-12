import { countryCode } from "../../domain/services/userCountry/userCountryModel.ts"
import { CSSProperties } from "react"

interface CountryFlagProps {
  code: countryCode
  disabled?: boolean
  slotProps?: slotProps
}

interface slotProps {
  picture?: CSSProperties
}

/**
 * Renders a country flag using the <picture> element with WebP and PNG fallbacks.
 *
 * @example
 * ```tsx
 * <CountryFlag code="ES" />
 * <CountryFlag code="US" disabled />
 * <CountryFlag code="FR" slotProps={{ picture: { borderRadius: 4 } }} />
 * ```
 */
export default function CountryFlag({ code, slotProps, disabled }: CountryFlagProps) {
  return (
    <picture style={slotProps?.picture}>
      <source
        type="image/webp"
        srcSet={`https://flagcdn.com/w20/${code}.webp, https://flagcdn.com/w40/${code}.webp 2x`}
      />
      <source
        type="image/png"
        srcSet={`https://flagcdn.com/w20/${code}.png, https://flagcdn.com/w40/${code}.png 2x`}
      />
      <img
        src={`https://flagcdn.com/w20/${code}.png`}
        width={20}
        alt={`${code} flag`}
        loading="lazy"
        style={{
          opacity: disabled ? 0.3 : 1, // display the image disabled
        }}
      />
    </picture>
  )
}
