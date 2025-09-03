import { createSvgIcon } from "@mui/material"

const GaliciaFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 810 540">
    <defs>
      {/* Rounded mask */}
      <clipPath id="roundClip">
        <rect x="0" y="0" width="810" height="540" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      {/* Paste the content of your Galicia.svg here */}
      {/* Example base flag (white with blue diagonal stripe) */}
      <rect width="810" height="540" fill="white" />
      <polygon points="0,540 180,540 810,0 630,0" fill="#00a3dd" />
    </g>
  </svg>,
  "GaliciaFlag",
)

export default GaliciaFlag
