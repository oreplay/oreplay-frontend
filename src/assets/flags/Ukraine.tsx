import { createSvgIcon } from "@mui/material"

const UkraineFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <rect width="900" height="300" fill="#0057B7" />
      <rect y="300" width="900" height="300" fill="#FFD700" />
    </g>
  </svg>,
  "UkraineFlag",
)

export default UkraineFlag
