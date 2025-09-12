import { createSvgIcon } from "@mui/material"

const CzechRepublicFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="600" height="400" rx="40" ry="40" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <path fill="#d7141a" d="M0 0h900v600H0z" />
      <path fill="#fff" d="M0 0h900v300H0z" />
      <path fill="#11457e" d="M450 300 0 0v600z" />
    </g>
  </svg>,
  "CzechRepublicFlag",
)
export default CzechRepublicFlag
