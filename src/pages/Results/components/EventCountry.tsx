import { Box, Typography } from "@mui/material"
import CountryFlag from "../../../components/CountryFlag/CountryFlag.tsx"
import { useCountry } from "../../../services/countryService/countryHooks.ts"

interface EventCountryProps {
  countryCode: string
}

export default function EventCountry({ countryCode }: EventCountryProps) {
  const countryT = useCountry()

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <CountryFlag
        code={countryCode.toLowerCase()}
        slotProps={{
          picture: { display: "flex", alignItems: "center" },
          image: { width: "12px", display: "block" },
        }}
      />
      <Typography sx={{ fontSize: 10, color: "text.secondary", fontWeight: 600, lineHeight: 1 }}>
        {countryT(countryCode)}
      </Typography>
    </Box>
  )
}
