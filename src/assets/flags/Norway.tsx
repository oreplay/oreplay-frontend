import { createSvgIcon } from "@mui/material"

const NorwayFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
    </defs>

    <g mask="url(#roundMask)">
      <rect width="50" height="30" fill="#ba0c2f" />
      <rect x="0" y="12" width="50" height="6" fill="#fff" />
      <rect x="15" y="0" width="6" height="30" fill="#fff" />
      <rect x="0" y="13.5" width="50" height="3" fill="#00205b" />
      <rect x="16.5" y="0" width="3" height="30" fill="#00205b" />
    </g>
  </svg>,
  "NorwayFlag",
)

export default NorwayFlag