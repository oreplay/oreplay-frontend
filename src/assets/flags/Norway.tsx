import { createSvgIcon } from "@mui/material"

const NorwayFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <path fill="#ba0c2f" d="M0 0h22v16H0z" />
      <path stroke="#fff" strokeWidth={4} d="M0 8h22M8 0v16" />
      <path stroke="#00205b" strokeWidth={2} d="M0 8h22M8 0v16" />
    </g>
  </svg>,
  "NorwayFlag",
)

export default NorwayFlag
