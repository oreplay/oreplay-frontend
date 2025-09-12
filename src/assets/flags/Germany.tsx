import { createSvgIcon } from "@mui/material"

const GermanyFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <path d="M0 0h5v3H0z" />
      <path fill="#D00" d="M0 1h5v2H0z" />
      <path fill="#FFCE00" d="M0 2h5v1H0z" />
    </g>
  </svg>,
  "GermanyFlag",
)

export default GermanyFlag
