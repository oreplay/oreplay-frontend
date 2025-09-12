import { createSvgIcon } from "@mui/material"

const FinlandFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
    </defs>

    <g mask="url(#roundMask)">
      <rect width="50" height="30" fill="#fff" />
      <rect x="0" y="12.5" width="50" height="5" fill="#002F6C" />
      <rect x="15" y="0" width="5" height="30" fill="#002F6C" />
    </g>
  </svg>,
  "FinlandFlag",
)

export default FinlandFlag