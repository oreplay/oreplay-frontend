import { createSvgIcon } from "@mui/material"

const CzechRepublicFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
    </defs>

    <g mask="url(#roundMask)">
      <rect width="50" height="15" fill="#fff" />
      <rect y="15" width="50" height="15" fill="#D7141A" />
      <path d="M0 0 L25 15 L0 30 Z" fill="#11457E" />
    </g>
  </svg>,
  "CzechRepublicFlag",
)

export default CzechRepublicFlag
